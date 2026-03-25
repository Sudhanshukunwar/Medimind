import { Router } from "express";
import { getUserHistory, getHistoryStats } from "../controllers/history.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Secure these routes so only logged-in users can see their own history
router.route("/all").get(verifyJWT, getUserHistory);
router.route("/stats").get(verifyJWT, getHistoryStats);

export default router;