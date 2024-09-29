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
exports.resolvers = void 0;
const db_1 = require("../../clients/db");
const user_1 = __importDefault(require("../../services/user"));
const redis_1 = require("../../clients/redis");
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
};
const queries = {
    verifyGoogleToken: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { token }) {
        const gtoken = yield user_1.default.verifyGoogleAuthToken(token);
        return gtoken;
    }),
    getCurrentUser: (parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        console.log(ctx);
        const id = (_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            return null;
        const user = yield user_1.default.getUserById(id);
        return user;
    }),
    getUserById: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { id }, ctx) { return yield user_1.default.getUserById(id); }),
    getLikedPostsByUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) { return yield user_1.default.getLikedPostsByUser(id); })
};
const mutations = {
    followUser: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { to }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error('Unauthenticated');
        yield user_1.default.followUser(ctx.user.id, to);
        yield redis_1.redisClient.del(`RECOMMANDED_USERS: ${ctx.user.id}`);
        return true;
    }),
    unFollowUser: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { to }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error('Unauthenticated');
        yield user_1.default.unFollowUser(ctx.user.id, to);
        yield redis_1.redisClient.del(`RECOMMANDED_USERS: ${ctx.user.id}`);
        return true;
    })
};
const extraResolvers = {
    User: {
        posts: (parent) => db_1.prismaClient.post.findMany({ where: { author: { id: parent.id } } }),
        follower: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield db_1.prismaClient.follows.findMany({
                where: { following: { id: parent.id } },
                include: {
                    follower: true,
                }
            });
            return result.map((el) => el.follower);
        }),
        following: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield db_1.prismaClient.follows.findMany({
                where: { follower: { id: parent.id } },
                include: {
                    following: true
                }
            });
            return result.map((el) => el.following);
        }),
        recommendedUsers: (parent, _, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (!ctx.user)
                return [];
            const cacheValue = yield redis_1.redisClient.get(`RECOMMANDED_USERS: ${ctx.user.id}`);
            if (cacheValue)
                return JSON.parse(cacheValue);
            const myFollowings = yield db_1.prismaClient.follows.findMany({
                where: {
                    follower: { id: ctx.user.id },
                },
                include: {
                    following: { include: { followers: { include: { following: true } } } }
                }
            });
            const userToBeRecommanded = [];
            for (const followings of myFollowings) {
                for (const followingOfFollowedUser of followings.following.followers) {
                    if (followingOfFollowedUser.following.id !== ((_a = ctx.user) === null || _a === void 0 ? void 0 : _a.id)
                        && myFollowings.findIndex((e) => { var _a; return (e === null || e === void 0 ? void 0 : e.following.id) === ((_a = followingOfFollowedUser === null || followingOfFollowedUser === void 0 ? void 0 : followingOfFollowedUser.following) === null || _a === void 0 ? void 0 : _a.id); }) < 0) {
                        userToBeRecommanded.push(followingOfFollowedUser === null || followingOfFollowedUser === void 0 ? void 0 : followingOfFollowedUser.following);
                    }
                }
            }
            const shuffledRecommendations = shuffleArray(userToBeRecommanded);
            const limitedRecommendations = userToBeRecommanded.slice(0, 10);
            yield redis_1.redisClient.set(`RECOMMANDED_USERS: ${ctx.user.id}`, JSON.stringify(limitedRecommendations));
            return limitedRecommendations;
        }),
    }
};
exports.resolvers = { queries, extraResolvers, mutations };
