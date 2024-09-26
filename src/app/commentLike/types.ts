export const types = `#graphql

    type CommentLike {
        id: ID!
        user: User!
        comment: Comment!
    }

    type CommentLikeResponse {
        isLiked: Boolean! 
        commentLike: CommentLike
    }

`