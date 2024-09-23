import { prismaClient } from '../../clients/db';

export const resolvers = {
    queries: {
        getCommentsByPost: async (_: any, { postId }: { postId: string }) => {
            return await prismaClient.comment.findMany({
                where: { postId },
                include: { user: true }  // Include author details
              });
        }
    },
    mutations: {
        addComment: async (_: any, { postId, content }: { postId: string, content: string }, ctx: any) => {
            if(!ctx.user || !ctx.user.id) throw new Error('You are Unauthenticated');

            const userId = ctx.user.id; 

            const postExists = await prismaClient.post.findUnique({
                where: { id: postId }
            });
        
            if (!postExists) {
                throw new Error('Post not found');
            }

            const comment = await prismaClient.comment.create({
                data: {
                    content,
                    post: { connect: { id: postId } },
                    user: { connect: { id: ctx.user.id } }
                }
            });
        
            return await prismaClient.comment.findUnique({
                where: { id: comment.id },
                include: { user: true }  
            });
        }
    }
};

