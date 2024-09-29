"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql

    type Like {
        id: ID!
        user: User!
        post: Post!
    }

    type LikeResponse {
        isLiked: Boolean! 
        like: Like
    }

`;
