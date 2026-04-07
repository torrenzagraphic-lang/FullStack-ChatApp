import { prisma } from "../../lib/db.js";

function normalizePair(a, b) {
    return a < b ? [a, b] : [b, a];
}

// 🔥 SEND REQUEST
export const sendFriendReq = async (senderId, receiverId) => {
    if (!receiverId) throw new Error("receiverId is required");

    if (senderId === receiverId) {
        throw new Error("You cannot send a friend request to yourself");
    }

    const [u1, u2] = normalizePair(senderId, receiverId);

    const existingFriend = await prisma.friend.findFirst({
        where: {
            userId1: u1,
            userId2: u2,
        },
    });

    if (existingFriend) {
        throw new Error("You are already friends");
    }

    const existing = await prisma.friendReq.findFirst({
        where: {
            OR: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
            ],
        },
        orderBy: { createdAt: "desc" },
    });

    // 🔥 MAIN LOGIC
    if (existing) {
        if (existing.status === "PENDING") {
            throw new Error("Friend request already exists");
        }

        if (existing.status === "CANCELLED" || existing.status === "REJECTED") {
            await prisma.friendReq.update({
                where: { id: existing.id },
                data: {
                    status: "PENDING",
                    senderId,
                    receiverId,
                },
            });

            return {
                success: true,
                message: "Friend request sent successfully",
            };
        }

        if (existing.status === "ACCEPTED") {
            throw new Error("You are already friends");
        }
    }

    // ✅ CREATE NEW
    await prisma.friendReq.create({
        data: {
            senderId,
            receiverId,
            status: "PENDING",
        },
    });

    return {
        success: true,
        message: "Friend request sent successfully",
    };
};
export const getFriendsDetailed = async (userId) => {
    const links = await prisma.friend.findMany({
        where: {
            OR: [{ userId1: userId }, { userId2: userId }],
        },
        include: {
            user1: {
                select: { id: true, name: true, email: true, image: true },
            },
            user2: {
                select: { id: true, name: true, email: true, image: true },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return links.map((l) => (l.userId1 === userId ? l.user2 : l.user1));
};
// 🔍 DISCOVER USERS
export const discoverUsers = async (userId, search = "") => {
    const q = search.trim();

    const users = await prisma.user.findMany({
        where: {
            id: { not: userId },
            ...(q
                ? {
                      OR: [
                          { name: { contains: q, mode: "insensitive" } },
                          { email: { contains: q, mode: "insensitive" } },
                      ],
                  }
                : {}),
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
        },
        take: 50,
    });

    const ids = users.map((u) => u.id);

    const [friends, outgoing, incoming] = await Promise.all([
        prisma.friend.findMany({
            where: {
                OR: ids.map((id) => {
                    const [u1, u2] = normalizePair(userId, id);
                    return { userId1: u1, userId2: u2 };
                }),
            },
        }),

        prisma.friendReq.findMany({
            where: {
                senderId: userId,
                receiverId: { in: ids },
                status: "PENDING",
            },
        }),

        prisma.friendReq.findMany({
            where: {
                receiverId: userId,
                senderId: { in: ids },
                status: "PENDING",
            },
        }),
    ]);

    const friendSet = new Set(friends.map((f) => `${f.userId1}:${f.userId2}`));

    return users.map((u) => {
        const [u1, u2] = normalizePair(userId, u.id);
        const key = `${u1}:${u2}`;

        let relationship = "NONE";
        let friendRequestId = null;

        const out = outgoing.find((r) => r.receiverId === u.id);
        const inc = incoming.find((r) => r.senderId === u.id);

        if (friendSet.has(key)) {
            relationship = "FRIEND";
        } else if (out) {
            relationship = "REQUEST_SENT";
            friendRequestId = out.id;
        } else if (inc) {
            relationship = "REQUEST_RECEIVED";
            friendRequestId = inc.id;
        }

        return { ...u, relationship, friendRequestId };
    });
};

// ✅ ACCEPT
export const acceptFriendReq = async (requestId, receiverId) => {
    const req = await prisma.friendReq.findFirst({
        where: { id: requestId, receiverId, status: "PENDING" },
    });

    if (!req) throw new Error("Friend request not found");

    const [u1, u2] = normalizePair(req.senderId, receiverId);

    await prisma.$transaction([
        prisma.friendReq.update({
            where: { id: requestId },
            data: { status: "ACCEPTED" },
        }),
        prisma.friend.upsert({
            where: {
                userId1_userId2: { userId1: u1, userId2: u2 },
            },
            create: { userId1: u1, userId2: u2 },
            update: {},
        }),
    ]);

    return { success: true };
};

// ❌ REJECT
export const rejectFriendReq = async (requestId, receiverId) => {
    const req = await prisma.friendReq.findFirst({
        where: { id: requestId, receiverId, status: "PENDING" },
    });

    if (!req) throw new Error("Friend request not found");

    await prisma.friendReq.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
    });

    return { success: true };
};

// 🚫 CANCEL
export const cancelFriendReq = async (requestId, senderId) => {
    const req = await prisma.friendReq.findFirst({
        where: { id: requestId, senderId, status: "PENDING" },
    });

    if (!req) throw new Error("Friend request not found");

    await prisma.friendReq.update({
        where: { id: requestId },
        data: { status: "CANCELLED" },
    });

    return { success: true };
};
