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
const db_1 = __importDefault(require("../clients/db"));
const redis_1 = require("../clients/redis");
class PostService {
    static createPost(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rateLimitFlag = yield redis_1.redisClient.get(`RATE_LIMIT:POST: ${data === null || data === void 0 ? void 0 : data.userId}`);
            if (rateLimitFlag) {
                return null;
            }
            const post = yield db_1.default.post.create({
                data: {
                    content: data.content,
                    imageURL: data.imageURL,
                    author: { connect: { id: data.userId } }
                },
                select: { id: true, createdAt: true, updatedAt: true },
            });
            yield redis_1.redisClient.del('ALL_POSTS');
            yield redis_1.redisClient.setex(`RATE_LIMIT:POST: ${data === null || data === void 0 ? void 0 : data.userId}`, 10, 1);
            return post;
        });
    }
    static getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedPosts = yield redis_1.redisClient.get('ALL_POSTS');
            if (cachedPosts)
                return JSON.parse(cachedPosts);
            const posts = yield db_1.default.post.findMany({ orderBy: { createdAt: 'desc' } });
            const postsWithFormattedDates = posts.map(post => (Object.assign(Object.assign({}, post), { createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString() })));
            yield redis_1.redisClient.set('ALL_POSTS', JSON.stringify(posts));
            yield redis_1.redisClient.expireat('ALL_POSTS', 36000);
            return posts;
        });
    }
}
exports.default = PostService;
