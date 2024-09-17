import { Post } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import * as dotenv from 'dotenv';
import UserService from "../../services/user";
import PostService, { CreatePostPayload } from "../../services/post";
dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION
});

const queries = {
    getAllPosts: () => PostService.getAllPosts(),
    getSignedURLForPost: async (parent: any, {imageName, imageType}: {imageName: string, imageType: string}, ctx: GraphqlContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error('You are Unauthenticated');
        
        const allowedImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
        if(!allowedImageTypes.includes(imageType)) throw new Error('Unsupported Image Type');

        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `uploads/${ctx.user.id}/posts/${imageName}-${Date.now()}.${imageType}`
        })

        const signedURL = await getSignedUrl(s3Client, putObjectCommand);
        return signedURL;
    } 
}

const mutations = {
    createPost: async (parent: any, {payload}: {payload: CreatePostPayload}, ctx: GraphqlContext) => {
        if(!ctx.user || !ctx.user?.id) throw new Error("You are not Authenticated!");

        return PostService.createPost({
            ...payload,
            userId: ctx.user.id
        }); 
    }
}

const extraResolvers = {
    Post: {
        author: (parent: Post) => UserService.getUserById(parent.authorId)
    }
}

export const resolvers = { mutations, extraResolvers, queries };