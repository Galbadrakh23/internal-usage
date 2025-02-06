"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
var auth_services_1 = require("../services/auth.services");
var authenticate = function (req, res, next) {
    var token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    var decoded = (0, auth_services_1.verifyToken)(token);
    if (!decoded) {
        return res
            .status(403)
            .json({ error: "Forbidden: Invalid or expired token" });
    }
    req.user = decoded; // Attach user info to request
    next();
};
exports.authenticate = authenticate;
