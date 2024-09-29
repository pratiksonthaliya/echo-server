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
        getCommentLikes: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { commentId }) {
            return prisma.commentLike.findMany({
                where: { commentId },
                include: { user: true, comment: true }
            });
        })
    },
    mutations: {
        toggleCommentLike: (_1, _a, ctx_1) => __awaiter(void 0, [_1, _a, ctx_1], void 0, function* (_, { commentId }, ctx) {
            console.log(ctx);
            if (!ctx.user || !ctx.user.id)
                throw new Error('You are Unauthenticated');
            const userId = ctx.user.id;
            const existingLike = yield prisma.commentLike.findUnique({
                where: { userId_commentId: { userId, commentId } },
                include: { user: true, comment: true }
            });
            if (existingLike) {
                const dislike = yield prisma.commentLike.delete({
                    where: { userId_commentId: { userId, commentId } },
                    include: { user: true, comment: true }
                });
                return { commentLike: dislike, isLiked: false };
            }
            else {
                const newLike = yield prisma.commentLike.create({
                    data: { userId, commentId },
                    include: { user: true, comment: true }
                });
                return { isLiked: true, commentLike: newLike };
            }
        })
    }
};
