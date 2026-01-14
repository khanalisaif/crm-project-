import express from "express";
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  convertLead,
  assignLead,
  addFollowUp,
  getLeadFollowUps,
} from "../controllers/lead.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";



const router = express.Router();

router.post("/", protect, adminOnly, createLead);
router.get("/", protect,  getLeads);
router.put("/:id", protect, adminOnly, updateLead);
router.delete("/:id", protect, adminOnly, deleteLead);
router.put("/:id/assign", protect, adminOnly, assignLead);
router.post("/:id/followup", protect, addFollowUp);
router.get("/:id/followups", protect, getLeadFollowUps);



router.post("/:id/convert", protect, convertLead);

export default router;
