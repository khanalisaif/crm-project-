import express from "express";
import {
  createTask,
  getTasks,
  completeTask,
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getTasks);

router.put("/:id/complete", protect, completeTask);

export default router;
