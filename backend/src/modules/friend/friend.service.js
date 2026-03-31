import { prisma } from '../../lib/db.js';

export const sendFriendReq = async (senderId, receiverId) => {};
export const getFriendsDetailed = async (userId) => {};
export const discoverUsers = async (userId, search = '') => {
    const q = search.trim();

    const users = await prisma.user.findMany({
        where: {
            id: { not: userId },
            ...(q
                ? {
                      OR: [
                          { name: { contains: q, mode: 'insensitive' } },
                          { email: { contains: q, mode: 'insensitive' } },
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
            createdAt: 'desc',
        },
        take: 50,
    });
};
