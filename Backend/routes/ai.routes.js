import { Router } from "express";
import { chatWithAI } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Optional: only for logged in users

const router = Router();

router.route("/chat").post(verifyJWT, chatWithAI);

export default router;