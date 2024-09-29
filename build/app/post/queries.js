"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql
    getAllPosts: [Post]
    getSignedURLForPost(imageName: String!, imageType: String!): String
`;
