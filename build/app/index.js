"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServer = initServer;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const user_1 = require("./user");
const post_1 = require("./post");
const like_1 = require("./like");
const comment_1 = require("./comment");
const commentLike_1 = require("./commentLike");
const bookmark_1 = require("./bookmark");
const jwt_1 = __importDefault(require("../services/jwt"));
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        app.get('/', (req, res) => {
            res.status(200).json({ message: 'Echo server is running' });
        });
        const graphqlServer = new server_1.ApolloServer({
            typeDefs: `
            ${user_1.User.types}
            ${post_1.Post.types}
            ${like_1.Like.types}
            ${comment_1.Comment.types}
            ${commentLike_1.CommentLike.types}
            ${bookmark_1.Bookmark.types}

            type Query {
                ${user_1.User.queries}
                ${post_1.Post.queries}
                ${like_1.Like.queries}
                ${comment_1.Comment.queries}
                ${commentLike_1.CommentLike.queries}
                ${bookmark_1.Bookmark.queries}
            }

            type Mutation {
                ${post_1.Post.mutations}
                ${user_1.User.mutations}
                ${like_1.Like.mutations}
                ${comment_1.Comment.mutations}
                ${commentLike_1.CommentLike.mutations}
                ${bookmark_1.Bookmark.mutations}
            }
        `,
            resolvers: Object.assign(Object.assign({ Query: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, user_1.User.resolvers.queries), post_1.Post.resolvers.queries), like_1.Like.resolvers.queries), comment_1.Comment.resolvers.queries), commentLike_1.CommentLike.resolvers.queries), bookmark_1.Bookmark.resolvers.queries), Mutation: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, post_1.Post.resolvers.mutations), user_1.User.resolvers.mutations), like_1.Like.resolvers.mutations), comment_1.Comment.resolvers.mutations), commentLike_1.CommentLike.resolvers.mutations), bookmark_1.Bookmark.resolvers.mutations) }, post_1.Post.resolvers.extraResolvers), user_1.User.resolvers.extraResolvers),
            introspection: true //process.env.NODE_ENV !== 'production'
        });
        yield graphqlServer.start();
        app.use('/graphql', express_1.default.json(), (0, express4_1.expressMiddleware)(graphqlServer, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req, res }) {
                return {
                    user: req.headers.authorization ? jwt_1.default.decodeToken(req.headers.authorization.split('Bearer ')[1]) : undefined
                };
            })
        }));
        return app;
    });
}
