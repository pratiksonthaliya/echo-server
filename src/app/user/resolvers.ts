import { prismaClient } from '../../clients/db';
import { GraphqlContext } from '../../interfaces';
import { User } from '@prisma/client';
import UserService from '../../services/user';



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
        return true;
    },

    unFollowUser: async (parent: any, { to }: {to: string}, ctx: GraphqlContext) => {
        if(!ctx.user || !ctx.user.id) throw new Error('Unauthenticated');

        await UserService.unFollowUser(ctx.user.id, to);
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
        }
    }
}
export const resolvers = { queries, extraResolvers, mutations };