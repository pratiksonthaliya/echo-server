import axios from 'axios';
import { prismaClient } from '../../clients/db';
import JWTService from '../../services/jwt';
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

const extraResolvers = {
    User: {
        posts: (parent: User) => prismaClient.post.findMany({ where: {author: {id: parent.id}}})
    }
}
export const resolvers = { queries, extraResolvers };