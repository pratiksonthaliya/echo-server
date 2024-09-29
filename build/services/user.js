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
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../clients/db");
const jwt_1 = __importDefault(require("./jwt"));
const redis_1 = require("../clients/redis");
class UserService {
    static verifyGoogleAuthToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const googleToken = token;
            const googleOAuthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
            googleOAuthURL.searchParams.set('id_token', googleToken);
            const { data } = yield axios_1.default.get(googleOAuthURL.toString(), {
                responseType: 'json'
            });
            const user = yield db_1.prismaClient.user.findUnique({
                where: { email: data.email }
            });
            if (!user) {
                yield db_1.prismaClient.user.create({
                    data: {
                        email: data.email,
                        firstName: data.given_name,
                        lastName: data.family_name,
                        profileImageUrl: data.picture
                    }
                });
            }
            const userInDb = yield db_1.prismaClient.user.findUnique({ where: { email: user === null || user === void 0 ? void 0 : user.email } });
            if (!userInDb) {
                throw new Error('User with email not found');
            }
            const userToken = yield jwt_1.default.generateTokenForUser(userInDb);
            return userToken;
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedUser = yield redis_1.redisClient.get(`USER: ${id}`);
            if (cachedUser)
                return JSON.parse(cachedUser);
            const user = yield db_1.prismaClient.user.findUnique({ where: { id } });
            yield redis_1.redisClient.set(`USER: ${id}`, JSON.stringify(user));
            return user;
        });
    }
    static followUser(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prismaClient.follows.create({
                data: {
                    follower: { connect: { id: from } },
                    following: { connect: { id: to } }
                }
            });
        });
    }
    static unFollowUser(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prismaClient.follows.delete({
                where: {
                    followerId_followingId: {
                        followerId: from, followingId: to
                    }
                }
            });
        });
    }
    static getLikedPostsByUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prismaClient.post.findMany({
                where: {
                    likes: {
                        some: {
                            userId: id,
                        },
                    },
                },
                include: {
                    author: true,
                    likes: true,
                },
            });
        });
    }
}
exports.default = UserService;
