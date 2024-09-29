"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql

    type Comment {
        id: ID!
        content: String!
        createdAt: String!
        post: Post!
        user: User!
    }

`;
