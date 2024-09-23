export const types = `#graphql

    type Comment {
        id: ID!
        content: String!
        createdAt: String!
        post: Post!
        user: User!
    }

`