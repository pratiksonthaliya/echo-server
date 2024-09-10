import { User } from './index';
export const queries = `#graphql
    verifyGoogleToken(token: String!): String 
    getCurrentUser: User
`