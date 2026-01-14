import express from "express";
import { getUsers } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);

export default router;
