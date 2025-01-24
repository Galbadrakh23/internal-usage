import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth.controller";

const router = Router();

router.post("/users", async (req, res) => {
  try {
    await createUser(req, res);
  } catch (error) {
    res.status(400).json({ error: "Шинэ хэрэглэгч нэмхэд алдаа гарлаа" });
  }
});

router.post("/login", async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Нэвтэрсэн хэрэглэгчийн мэдээллийг татхад алдаа гарлаа" });
  }
});
export default router;
