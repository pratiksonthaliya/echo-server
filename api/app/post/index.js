"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const queries_1 = require("./queries");
const mutations_1 = require("./mutations");
const resolvers_1 = require("./resolvers");
const types_1 = require("./types");
exports.Post = { types: types_1.types, resolvers: resolvers_1.resolvers, mutations: mutations_1.mutations, queries: queries_1.queries };
