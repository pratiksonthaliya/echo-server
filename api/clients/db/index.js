"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
let prismaClient;
// Use the global object to store the Prisma client in development mode
if (process.env.NODE_ENV === 'production') {
    // In production, instantiate PrismaClient once
    prismaClient = new client_1.PrismaClient();
}
else {
    // In development, reuse the PrismaClient instance
    if (!global.prismaClient) {
        global.prismaClient = new client_1.PrismaClient();
    }
    prismaClient = global.prismaClient;
}
exports.default = prismaClient;
