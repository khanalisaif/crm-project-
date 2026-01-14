import Lead from "../models/Lead.model.js";
import Customer from "../models/Customer.model.js";
import Task from "../models/Task.model.js";


export const createLead = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, Email and Phone are required",
      });
    }

    const lead = await Lead.create({ name, email, phone });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.error("Create Lead Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create lead",
    });
  }
};



export const getLeads = async (req, res) => {
  try {
    let filter = {};

    // 👑 ADMIN → sab leads
    if (req.user.role === "Admin") {
      filter = {};
    }

    if (req.user.role !== "Admin") {
      filter = { assignedTo: req.user.id };
    }

    const leads = await Lead.find(filter);

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};



export const updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead: updatedLead,
    });
  } catch (error) {
    console.error("Update Lead Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lead",
    });
  }
};


export const deleteLead = async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);

    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
    });
  }
};

export const convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      !lead.assignedTo ||
      lead.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Only assigned user can convert this lead",
      });
    }

    const existingCustomer = await Customer.findOne({
      email: lead.email,
    });

    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists",
      });
    }

    const customer = await Customer.create({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      leadId: lead._id,
      createdBy: req.user.id, 
    });

    await Lead.findByIdAndDelete(lead._id);

    res.status(200).json({
      success: true,
      message: "Lead converted to customer",
      customer,
    });
  } catch (error) {
    console.error("Convert Lead Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to convert lead",
    });
  }
};

export const assignLead = async (req, res) => {
  const { userId } = req.body;

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { assignedTo: userId },
    { new: true }
  );

  res.json({
    success: true,
    message: "Lead assigned successfully",
    lead,
  });
};


export const addFollowUp = async (req, res) => {
  try {

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (!lead.assignedTo) {
      return res
        .status(400)
        .json({ message: "Lead not assigned" });
    }

    if (lead.assignedTo.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not your lead" });
    }

    lead.followUps.push({
      note: req.body.note,
      user: req.user.id,
    });
    await lead.save();


    const task = await Task.create({
      title: `Follow-up: ${lead.name}`,
      lead: lead._id,
      assignedTo: req.user.id,
      completed: false,
    });


    res.status(201).json({
      success: true,
      message: "Follow-up added & task created",
      task,
    });
  } catch (error) {
    console.error("FOLLOWUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLeadFollowUps = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("followUps.user", "name");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({
      success: true,
      followUps: lead.followUps,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

