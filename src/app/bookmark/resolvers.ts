import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
    queries: {
        getUserBookmarks: async (_: any, { userId }: { userId: string }) => {
            return prisma.bookmark.findMany({
                where: { userId },
                include: { user: true, post: true }
            });
        }
    },
    mutations: {
        toggleBookmark: async (_: any, { postId }: { postId: string }, ctx: any) => {
            if(!ctx.user || !ctx.user.id) throw new Error('You are Unauthenticated');

            const userId = ctx.user.id; 

            const existingBookmark = await prisma.bookmark.findUnique({
                where: { userId_postId: { userId, postId } },
                include: {user: true, post: true}
            });

            if (existingBookmark) {
                const removeBookmark = await prisma.bookmark.delete({
                    where: {userId_postId: { userId, postId }},
                    include: {user: true, post: true}
                });
                return { bookmark: removeBookmark, isBookmarked: false}
            } 
            else {
                const addBookmark = await prisma.bookmark.create({
                    data: { userId, postId },
                    include: { user: true, post: true }
                });
                return { isBookmarked: true, bookmark: addBookmark };
            }
        }
    }
};

