export const types = `#graphql

    type Like {
        id: ID!
        user: User!
        post: Post!
    }

    type LikeResponse {
        isLiked: Boolean! 
        like: Like
    }

`