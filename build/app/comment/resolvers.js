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
const db_1 = require("../../clients/db");
exports.resolvers = {
    queries: {
        getCommentsByPost: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { postId }) {
            return yield db_1.prismaClient.comment.findMany({
                where: { postId },
                include: { user: true } // Include author details
            });
        })
    },
    mutations: {
        addComment: (_1, _a, ctx_1) => __awaiter(void 0, [_1, _a, ctx_1], void 0, function* (_, { postId, content }, ctx) {
            if (!ctx.user || !ctx.user.id)
                throw new Error('You are Unauthenticated');
            const userId = ctx.user.id;
            const postExists = yield db_1.prismaClient.post.findUnique({
                where: { id: postId }
            });
            if (!postExists) {
                throw new Error('Post not found');
            }
            const comment = yield db_1.prismaClient.comment.create({
                data: {
                    content,
                    post: { connect: { id: postId } },
                    user: { connect: { id: ctx.user.id } }
                }
            });
            return yield db_1.prismaClient.comment.findUnique({
                where: { id: comment.id },
                include: { user: true }
            });
        })
    }
};
