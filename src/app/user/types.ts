export const types = `#graphql

    type User {
        id: ID!
        firstName: String!
        lastName: String
        email: String!
        profileImageUrl: String

        follower: [User]
        following: [User]

        recommendedUsers: [User]

        posts: [Post]
    }

`