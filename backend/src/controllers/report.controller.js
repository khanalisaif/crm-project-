import Lead from "../models/Lead.model.js";
import Deal from "../models/Deal.model.js";



export const getReports = async (req, res) => {
  try {
    const dealFilter =
      req.user.role === "Admin"
        ? {}
        : { createdBy: req.user.id };

    const totalLeads = await Lead.countDocuments();

    const wonDeals = await Deal.find({
      ...dealFilter,
      stage: "Won",
    });

    const lostDeals = await Deal.countDocuments({
      ...dealFilter,
      stage: "Lost",
    });

    const revenue = wonDeals.reduce(
      (sum, deal) => sum + (deal.value || 0),
      0
    );

    res.status(200).json({
      success: true,
      reports: {
        totalLeads,
        wonDeals: wonDeals.length,
        lostDeals,
        revenue,
      },
    });
  } catch (error) {
    console.error("Get Reports Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};
