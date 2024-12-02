import { checkAuth, login, logout, signUp, updateProfile } from "@/controllers/auth.controller";
import { protectRoute } from "@/middleware/auth.middleware";
import { Router } from "express";

const router: Router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.put("/update-profile", protectRoute, updateProfile);
router.post("/logout", logout);

router.get("/check", protectRoute, checkAuth);

export default router;