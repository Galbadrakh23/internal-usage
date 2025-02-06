import { Router } from "express";
import {
  register,
  login,
  verify,
  logout,
} from "../controllers/auth.controller";
const { authenticate } = require("../middleware/authMiddleware");
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", authenticate, verify); // Protected

export default router;
