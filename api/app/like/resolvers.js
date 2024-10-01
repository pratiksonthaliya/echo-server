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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.resolvers = {
    queries: {
        getPostLikes: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { postId }) {
            return prisma.like.findMany({
                where: { postId },
                include: { user: true, post: true }
            });
        })
    },
    mutations: {
        toggleLike: (_1, _a, ctx_1) => __awaiter(void 0, [_1, _a, ctx_1], void 0, function* (_, { postId }, ctx) {
            if (!ctx.user || !ctx.user.id)
                throw new Error('You are Unauthenticated');
            const userId = ctx.user.id;
            const existingLike = yield prisma.like.findUnique({
                where: { userId_postId: { userId, postId } },
                include: { user: true, post: true }
            });
            if (existingLike) {
                const dislike = yield prisma.like.delete({
                    where: { userId_postId: { userId, postId } },
                    include: { user: true, post: true }
                });
                return { like: dislike, isLiked: false };
            }
            else {
                const newLike = yield prisma.like.create({
                    data: { userId, postId },
                    include: { user: true, post: true }
                });
                return { isLiked: true, like: newLike };
            }
        })
    }
};
