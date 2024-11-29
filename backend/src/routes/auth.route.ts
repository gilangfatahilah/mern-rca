import { login, logout, signUp } from "@/controllers/auth.controller";
import { Router } from "express";

const router: Router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;