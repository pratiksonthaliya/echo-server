import { prismaClient } from '../../clients/db';
import { GraphqlContext } from '../../interfaces';
import { User } from '@prisma/client';
import UserService from '../../services/user';
import { redisClient } from '../../clients/redis';



const queries = {
    verifyGoogleToken: async(parent: any, {token}: {token : string}) => {
        const gtoken = await UserService.verifyGoogleAuthToken(token);
        return gtoken;
    },
    getCurrentUser: async(parent: any, args: any, ctx: GraphqlContext) => {
        console.log(ctx); 
        const id = ctx.user?.id;
        if(!id) return null;

        const user = await UserService.getUserById(id) 
        return user ;
    },
    getUserById : async(parent: any, {id}: {id: string}, ctx: GraphqlContext) => await UserService.getUserById(id) 

}

const mutations = {
    followUser: async (parent: any, { to }: {to: string}, ctx: GraphqlContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error('Unauthenticated');

        await UserService.followUser(ctx.user.id, to);
        await redisClient.del(`RECOMMANDED_USERS: ${ctx.user.id}`);
        return true;
    },

    unFollowUser: async (parent: any, { to }: {to: string}, ctx: GraphqlContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error('Unauthenticated');

        await UserService.unFollowUser(ctx.user.id, to);
        await redisClient.del(`RECOMMANDED_USERS: ${ctx.user.id}`);
        return true;
    }
}

const extraResolvers = {
    User: {
        posts: (parent: User) => prismaClient.post.findMany({ where: {author: {id: parent.id}}}),
        follower: async (parent: User) => {
            const result = await prismaClient.follows.findMany({
                where: { following: { id: parent.id} },
                include: {
                    follower: true,
                }
            })
            return result.map((el) => el.follower);
        },
        following: async (parent: User) => {
            const result = await prismaClient.follows.findMany({
                where: { follower: { id: parent.id} },
                include: {
                    following: true
                }
            })
            return result.map((el) => el.following);
        },
        recommendedUsers: async (parent: User, _: any, ctx: GraphqlContext) => {
            if(!ctx.user) return [];

            const cacheValue = await redisClient.get(`RECOMMANDED_USERS: ${ctx.user.id}`);
            if(cacheValue) return JSON.parse(cacheValue);

            const myFollowings = await prismaClient.follows.findMany({
                where: {
                    follower: {id: ctx.user.id},
                },
                include: {
                    following: { include: { followers: { include: { following: true }}}}
                }
            });

            const userToBeRecommanded: User[] = [];
            for(const followings of myFollowings){
                for(const followingOfFollowedUser of followings.following.followers){
                    if(followingOfFollowedUser.following.id !== ctx.user?.id
                        && myFollowings.findIndex((e) => e?.following.id === followingOfFollowedUser?.following?.id) < 0
                    ){
                        userToBeRecommanded.push(followingOfFollowedUser?.following);
                    }
                }
            }

            await redisClient.set(`RECOMMANDED_USERS: ${ctx.user.id}`, JSON.stringify(userToBeRecommanded));

            return userToBeRecommanded;
        },
    }
}
export const resolvers = { queries, extraResolvers, mutations };