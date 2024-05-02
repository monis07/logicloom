"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Problem = exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    problem: [{
            _id: mongoose_1.default.Schema.Types.ObjectId,
            status: { type: String, default: "Not Solved" },
            code: { type: String, default: "" }
        }]
});
const problemSchema = new mongoose_1.default.Schema({
    title: String,
    difficulty: String,
    description: String,
    codeSnippet: String,
    testcases: [{
            input: Object,
            expectedOutput: String
        }]
});
exports.Admin = mongoose_1.default.model('Admin', adminSchema);
exports.Problem = mongoose_1.default.model('Problem', problemSchema);
