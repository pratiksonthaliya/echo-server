import cors from 'cors';
import { Query, Mutation } from './../../node_modules/@apollo/server/src/plugin/schemaReporting/generated/operations.d';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { User } from './user'

export async function initServer() {     
    const app = express();

    app.use(express.json());
    app.use(cors());

    const graphqlServer = new ApolloServer({
        typeDefs: `
            ${User.types}

            type Query {
                ${User.queries}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            }, 
            // Mutation: {} 
        },
    });

    await graphqlServer.start();
    app.use('/graphql', express.json(), expressMiddleware(graphqlServer));

    return app;
}