import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js"; // ✅ ADD THIS
import leadRoutes from "./routes/lead.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import dealRoutes from "./routes/deal.routes.js";
import taskRoutes from "./routes/task.routes.js";
import reportRoutes from "./routes/report.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running ");
}); 

app.use("/api/auth", authRoutes); 

app.use("/api/leads", leadRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

export default app;
