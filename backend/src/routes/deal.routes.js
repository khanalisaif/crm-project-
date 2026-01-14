import express from "express";
import {
  createDeal,
  getDeals,
  updateDealStage,
} from "../controllers/deal.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createDeal);
router.get("/", protect, getDeals);

router.put("/:id/stage", protect, updateDealStage);

export default router;
