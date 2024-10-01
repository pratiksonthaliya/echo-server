"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql

    type CommentLike {
        id: ID!
        user: User!
        comment: Comment!
    }

    type CommentLikeResponse {
        isLiked: Boolean! 
        commentLike: CommentLike
    }

`;
