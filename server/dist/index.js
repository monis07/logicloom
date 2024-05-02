"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const admin_1 = __importDefault(require("./routes/admin"));
const port = 3000;
const url = process.env.MONGO_DB_URL || '';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use('/admin', admin_1.default);
app.listen(port, () => {
    console.log("Server is listening on port " + port);
});
mongoose_1.default.connect(url, { dbName: 'leetcode-clone' });
