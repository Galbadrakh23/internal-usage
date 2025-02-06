"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var user_routes_1 = __importDefault(require("./routes/user-routes"));
var report_routes_1 = __importDefault(require("./routes/report-routes"));
var auth_routes_1 = __importDefault(require("./routes/auth-routes"));
var hourly_routes_1 = __importDefault(require("./routes/hourly-routes"));
var employee_routes_1 = __importDefault(require("./routes/employee-routes"));
var cors = require("cors");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow cookies
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/", user_routes_1.default);
app.use("/api/", report_routes_1.default);
app.use("/api/", auth_routes_1.default);
app.use("/api/", report_routes_1.default);
app.use("/api/", hourly_routes_1.default);
app.use("/api/", employee_routes_1.default);
exports.default = app;
