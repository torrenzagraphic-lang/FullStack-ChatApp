import { prisma } from "../../lib/db.js";

function normalizePair(a, b) {
    return a < b ? [a, b] : [b, a];
}

export const sendFriendReq = async (senderId, receiverId) => {};
export const getFriendsDetailed = async (userId) => {};
export const discoverUsers = async (userId, search = "") => {
    const q = search.trim();

    const users = await prisma.user.findMany({
        where: {
            id: { not: userId },
            ...(q
                ? {
                      R: [
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
        orderBy: {
            createdAt: "desc",
        },
        take: 50,
    });

    if (users.length === 0) return [];

    const ids = users.map((u) => u.id);

    const friendPairs = ids.map((otherId) => {
        const [u1, u2] = normalizePair(userId, otherId);
        return { userId1: u1, userId2: u2 };
    });

    const [friends, outgoing, incoming] = await Promise.all([
        prisma.friend.findMany({
            where: { OR: friendPairs },
            select: {
                userId1: true,
                userId2: true,
            },
        }),
        prisma.friendReq.findMany({
            where: {
                senderId: userId,
                receiverId: { in: ids },
                status: "PENDING",
            },
            select: {
                receiverId: true,
                id: true,
            },
        }),
        prisma.friendReq.findMany({
            where: {
                receiverId: userId,
                senderId: { in: ids },
                status: "PENDING",
            },
            select: {
                senderId: true,
                id: true,
            },
        }),
    ]);

    const friendSet = new Set(
        friends.map((f) => {
            const [u1, u2] = normalizePair(f.userId1, f.userId2);
            return `${u1}:${u2}`;
        }),
    );

    const outgoingSet = new Set(outgoing.map((r) => r.receiverId));
    const incomingSet = new Set(incoming.map((r) => r.senderId));

    return user.map((u) => {
        const [u1, u2] = normalizePair(userId, u.id);
        const key = `${u1}:${u2}`;

        let relationship = "NONE";
        let friendReqId = null;

        if (friendSet.has(key)) {
            relationship = "FRIEND";
        } else if (outgoingSet.has(u.id)) {
            relationship = "REQUEST_SENT";
            friendReqId = outgoing.find((r) => r.receiverId === u.id)?.id;
        } else if (incomingSet.has(u.id)) {
            relationship = "REQUEST_RECEIVED";
            friendReqId = incoming.find((r) => r.senderId === u.id)?.id;
        }
        return { ...u, relationship, friendReqId };
    });
};
