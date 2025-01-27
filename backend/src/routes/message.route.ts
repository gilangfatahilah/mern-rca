import express, { Router } from "express";

import { getMessages, getUsers, sendMessage } from "../controllers/message.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.get("/users", protectRoute, getUsers);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router