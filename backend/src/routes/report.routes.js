import express from "express";
import { getReports } from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();
router.get("/", protect, adminOnly, getReports);
export default router;
