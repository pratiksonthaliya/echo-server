import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
    queries: {
        getPostLikes: async (_: any, { postId }: { postId: string }) => {
            return prisma.like.findMany({
                where: { postId },
                include: { user: true, post: true }
            });
        }
    },
    mutations: {
        toggleLike: async (_: any, { postId }: { postId: string }, ctx: any) => {
            if(!ctx.user || !ctx.user.id) throw new Error('You are Unauthenticated');

            const userId = ctx.user.id; 

            const existingLike = await prisma.like.findUnique({
                where: { userId_postId: { userId, postId } },
                include: {user: true, post: true}
            });

            if (existingLike) {
                const dislike = await prisma.like.delete({
                    where: {userId_postId: { userId, postId }},
                    include: {user: true, post: true}
                });
                return { like: dislike, isLiked: false}
            } 
            else {
                const newLike = await prisma.like.create({
                    data: { userId, postId },
                    include: { user: true, post: true }
                });
                return { isLiked: true, like: newLike };
            }
        }
    }
};

export default resolvers;
