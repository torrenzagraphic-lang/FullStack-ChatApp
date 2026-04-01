import { prisma } from '../../lib/db.js';




function normalizePair(a, b) {
    return a < b ? [a, b] : [b, a];
}

export const sendFriendReq = async (senderId, receiverId) => { };
export const getFriendsDetailed = async (userId) => { };
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

    if (users.length === 0) return [];


    const ids = users.map((u) => u.id)

    const friendPairs = ids.map((otherId) => {
        const [u1, u2] = normalizePair(userId, otherId)
        return { userId1:u1 , userId2:u2}
    })

    const [] = await Promise.all([
        
    ])

};
