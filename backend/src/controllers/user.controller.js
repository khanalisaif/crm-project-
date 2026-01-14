import User from "../models/User.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      { role: { $ne: "Admin" } }, 
      "name email role"
    );

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};
