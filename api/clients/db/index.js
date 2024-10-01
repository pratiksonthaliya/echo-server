"use strict";
// import { PrismaClient } from '@prisma/client';
Object.defineProperty(exports, "__esModule", { value: true });
// // Add this line to prevent TypeScript from complaining about global.prismaClient
// declare global {
//   var prismaClient: PrismaClient | undefined;
// }
// let prismaClient: PrismaClient;
// // Use the global object to store the Prisma client in development mode
// if (process.env.NODE_ENV === 'production') {
//   // In production, instantiate PrismaClient once
//   prismaClient = new PrismaClient();
// } else {
//   // In development, reuse the PrismaClient instance
//   if (!global.prismaClient) {
//     global.prismaClient = new PrismaClient();
//   }
//   prismaClient = global.prismaClient;
// }
// export default prismaClient;
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
exports.default = prismaClient;
