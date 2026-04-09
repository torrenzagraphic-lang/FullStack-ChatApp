import { prisma } from "../../lib/db.js";

function normalizePair(a, b) {
    return a < b ? [a, b] : [b, a];
}

export const sendMessage = async (senderId, receiverId, content) => {
    if (!content) {
        throw new Error("Content is required cannot be empty");
    }
    if (senderId === receiverId) {
        throw new Error("You cannot send a Message to yourself");
    }

    const [u1, u2] = normalizePair(senderId, receiverId);

    const existingFriend = await prisma.friend.findFirst({
        where: {
            userId1: u1,
            userId2: u2,
        },
    });

    if (!existingFriend) {
        throw new Error("You can only send message to friends");
    }
    const message = await prisma.message.create({
        data: {
            senderId,
            receiverId,
            content,
        },
    });
    return message;
};

export const getMessage = async (
    userId1,
    userId2,
    limit = 50,
    cursor = null,
) => {
    const where = {
        OR: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 },
        ],
    };

    if (cursor) {
        where.AND = {
            createdAt: { lt: new Date(cursor) },
        };
    }

    const messages = await prisma.message.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit + 1,
    });

    const hasMore = messages.length > limit;
    const results = hasMore ? messages.slice(0, limit) : messages;

    return {
        messages: results.reverse(),
        hasMore,
        nextCursor: hasMore
            ? results[results.length - 1].createdAt.toISOString()
            : null,
    };
};

export const markMessagesAsRead = async (userId, senderId) => {
    await prisma.message.updateMany({
        where: {
            senderId: senderId,
            receiverId: userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
};

export async function getConversation(userId) {
    const friendShips = await prisma.friend.findMany({
        where: {
            OR: [
                {
                    userId1: userId,
                },
            ],
        },
    });
}
