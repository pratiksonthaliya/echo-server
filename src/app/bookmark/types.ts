export const types = `#graphql

    type Bookmark {
        id: ID!
        user: User!
        post: Post!
    }

    type BookmarkResponse {
        isBookmarked: Boolean! 
        bookmark: Bookmark
    }

`