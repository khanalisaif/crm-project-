import Deal from "../models/Deal.model.js";
import Customer from "../models/Customer.model.js";



export const createDeal = async (req, res) => {
  try {
    const { title, customer, value } = req.body;

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer is required",
      });
    }


    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer",
      });
    }



    if (
      existingCustomer.createdBy &&
      existingCustomer.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to create deal for this customer",
      });
    }

    const deal = await Deal.create({
      title,
      customer,
      value,
      stage: "New",
      createdBy: req.user.id, 
    });

    res.status(201).json({
      success: true,
      message: "Deal created successfully",
      deal,
    });
  } catch (error) {
    console.error("Create Deal Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const getDeals = async (req, res) => {
  try {
    const filter =
      req.user.role === "Admin"
        ? {}
        : { createdBy: req.user.id };

    const deals = await Deal.find(filter).populate("customer");

    res.status(200).json({
      success: true,
      count: deals.length,
      deals,
    });
  } catch (error) {
    console.error("Get Deals Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




export const updateDealStage = async (req, res) => {
  try {
    const { stage } = req.body;
    const { id } = req.params;

    if (!stage) {
      return res.status(400).json({
        success: false,
        message: "Stage is required",
      });
    }

    const deal = await Deal.findById(id);
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    if (["Won", "Lost"].includes(deal.stage)) {
      return res.status(400).json({
        success: false,
        message: "Deal already closed",
      });
    }

    if (
      req.user.role !== "Admin" &&
      deal.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to update this deal",
      });
    }

    deal.stage = stage;
    await deal.save();

    if (stage === "Won" || stage === "Lost") {
      await Customer.findByIdAndUpdate(deal.customer, {
        status: "Completed",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deal stage updated",
      deal,
    });
  } catch (error) {
    console.error("Update Deal Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
