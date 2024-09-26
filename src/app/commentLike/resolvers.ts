import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
    queries: {
        getCommentLikes: async (_: any, { commentId }: { commentId: string }) => {
            return prisma.commentLike.findMany({
                where: { commentId },
                include: { user: true, comment: true }
            });
        }
    },
    mutations: {
        toggleCommentLike: async (_: any, { commentId }: { commentId: string }, ctx: any) => {
            console.log(ctx);
            
            if(!ctx.user || !ctx.user.id) throw new Error('You are Unauthenticated');

            const userId = ctx.user.id; 

            const existingLike = await prisma.commentLike.findUnique({
                where: { userId_commentId: { userId, commentId } },
                include: {user: true, comment: true}
            });

            if (existingLike) {
                const dislike = await prisma.commentLike.delete({
                    where: {userId_commentId: { userId, commentId }},
                    include: {user: true, comment: true}
                });
                return { commentLike: dislike, isLiked: false}
            } 
            else {
                const newLike = await prisma.commentLike.create({
                    data: { userId, commentId },
                    include: { user: true, comment: true }
                });
                return { isLiked: true, commentLike: newLike };
            }
        }
    }
};

