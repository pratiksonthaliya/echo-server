import cors from 'cors';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { User } from './user';
import { Post } from './post'; 
import { Like } from './like';
import { Comment } from './comment';
import { CommentLike } from './commentLike';
import { Bookmark } from './bookmark';
import { GraphqlContext } from '../interfaces';
import JWTService from '../services/jwt';

export async function initServer() {     
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.get('/', (req, res) => {
        res.status(200).json({message: 'Echo server is running'});
    });

    const graphqlServer = new ApolloServer<GraphqlContext>({
        typeDefs: `
            ${User.types}
            ${Post.types}
            ${Like.types}
            ${Comment.types}
            ${CommentLike.types}
            ${Bookmark.types}

            type Query {
                ${User.queries}
                ${Post.queries}
                ${Like.queries}
                ${Comment.queries}
                ${CommentLike.queries}
                ${Bookmark.queries}
            }

            type Mutation {
                ${Post.mutations}
                ${User.mutations}
                ${Like.mutations}
                ${Comment.mutations}
                ${CommentLike.mutations}
                ${Bookmark.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Post.resolvers.queries,
                ...Like.resolvers.queries,
                ...Comment.resolvers.queries,
                ...CommentLike.resolvers.queries,
                ...Bookmark.resolvers.queries,
            }, 
            Mutation: {
                ...Post.resolvers.mutations, 
                ...User.resolvers.mutations,
                ...Like.resolvers.mutations,
                ...Comment.resolvers.mutations,
                ...CommentLike.resolvers.mutations,
                ...Bookmark.resolvers.mutations,
            },
            ...Post.resolvers.extraResolvers,
            ...User.resolvers.extraResolvers
        },
        introspection: true //process.env.NODE_ENV !== 'production'
    });

    await graphqlServer.start();
    app.use('/graphql', express.json(),  expressMiddleware(graphqlServer, 
        { 
            context: async ({req, res}) => {
                return {
                    user: req.headers.authorization ? JWTService.decodeToken(req.headers.authorization.split('Bearer ')[1]) : undefined
                }
            }
        }
    ));

    return app;
}