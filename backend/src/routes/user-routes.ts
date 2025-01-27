import { Router } from "express";
import { getAllUsers } from "../controllers/user.controller";

const router = Router();

// router.use(authentication);
// Route to get all users
router.get("/users", async (req, res) => {
  try {
    await getAllUsers(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
