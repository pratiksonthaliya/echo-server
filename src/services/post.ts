import prismaClient from '../clients/db';
import { redisClient } from "../clients/redis";

export interface CreatePostPayload {
    content: string
    imageURL?: string
    userId: string
}

class PostService {
    public static async createPost(data : CreatePostPayload){
        const rateLimitFlag = await redisClient.get(`RATE_LIMIT:POST: ${data?.userId}`);
        if (rateLimitFlag) {
            return null;
        }
        const post = await prismaClient.post.create({
            data: {
                content: data.content,
                imageURL: data.imageURL,
                author: {connect: { id: data.userId }}
            },
            select: { id: true, createdAt: true, updatedAt: true },
        })
        await redisClient.del('ALL_POSTS');
        await redisClient.setex(`RATE_LIMIT:POST: ${data?.userId}`, 10, 1);
        return post;
    }
    public static async getAllPosts() {
        const cachedPosts = await redisClient.get('ALL_POSTS');
        if(cachedPosts) return JSON.parse(cachedPosts);

        const posts = await prismaClient.post.findMany({orderBy: {createdAt: 'desc'}});

        const postsWithFormattedDates = posts.map(post => ({
            ...post,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString()
        }));

        await redisClient.set('ALL_POSTS', JSON.stringify(posts));
        await redisClient.expireat('ALL_POSTS', 36000);

        return posts;
    }
}

export default PostService;