"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.generateToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var JWT_TOKEN_PASSWORD = process.env.JWT_TOKEN_PASSWORD;
if (!JWT_TOKEN_PASSWORD) {
    throw new Error("JWT_TOKEN_PASSWORD is not defined in the environment variables");
}
var generateToken = function (payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_TOKEN_PASSWORD, {
        expiresIn: "24h",
    });
};
exports.generateToken = generateToken;
var decodeToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_TOKEN_PASSWORD);
    }
    catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
exports.decodeToken = decodeToken;
