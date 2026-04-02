import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import eventRoutes from "./routes/event.routes.js";
import { responseMiddleware } from "./middleware/response.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());
app.use(responseMiddleware);

app.use("/auth", authRoutes);
app.use("/calendars", calendarRoutes);
app.use("/events", eventRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
