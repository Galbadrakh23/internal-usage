import { Router } from "express";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/users", async (req, res) => {
  try {
    await getAllUsers(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
router.put("/users/:id", async (req, res) => {
  try {
    await updateUser(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await deleteUser(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    await updateUser(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
