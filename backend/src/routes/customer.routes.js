import express from "express";
import {
  getActiveCustomers,
  getCompletedCustomers,
} from "../controllers/customer.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/active", protect, getActiveCustomers);
router.get("/completed", protect, getCompletedCustomers);

export default router;
