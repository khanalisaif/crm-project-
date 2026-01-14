import Customer from "../models/Customer.model.js";

export const getActiveCustomers = async (req, res) => {
  try {
    const filter =
      req.user.role === "Admin"
        ? { status: "Active" }
        : {
            status: "Active",
            createdBy: req.user.id, 
          };

    const customers = await Customer.find(filter);

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active customers",
    });
  }
};


export const getCompletedCustomers = async (req, res) => {
  try {
    const filter =
      req.user.role === "Admin"
        ? { status: "Completed" }
        : {
            status: "Completed",
            createdBy: req.user.id, 
          };

    const customers = await Customer.find(filter);

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch completed customers",
    });
  }
};

