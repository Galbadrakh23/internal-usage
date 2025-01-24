import { Router } from "express";
import { getAllUsers, getUserProfile } from "../controllers/user.controller";

const router = Router();

// Route to get all users
router.get("/users", async (req, res) => {
  try {
    await getAllUsers(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
