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
) => {};

export const markMessagesAsRead = async (userId, senderId) => {};

export async function getConversation(userId) {}
