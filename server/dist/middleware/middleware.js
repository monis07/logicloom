"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.SECRET_KEY || 'secret';
function authenticateJwt(req, res, next) {
    const token = req.headers.authorization;
    console.log(token);
    if (token) {
        jsonwebtoken_1.default.verify(token, SECRET, (err, decoded) => {
            if (err) {
                res.status(401).send("Something went wrong");
            }
            else {
                next();
            }
        });
    }
    else {
        res.send("Unauthorised access!");
    }
}
exports.default = authenticateJwt;
