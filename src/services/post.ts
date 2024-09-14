import { prismaClient } from "../clients/db";

export interface CreatePostPayload {
    content: string
    imageURL?: string
    userId: string
}

class PostService {
    public static async createPost(data : CreatePostPayload){
        return await prismaClient.post.create({
            data: {
                content: data.content,
                imageURL: data.imageURL,
                author: {connect: { id: data.userId }}
            }
        })
    }
    public static async getAllPosts() {
        return await prismaClient.post.findMany({orderBy: {createdAt: 'desc'}})
    }
}

export default PostService;