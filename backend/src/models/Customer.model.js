import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },

    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
