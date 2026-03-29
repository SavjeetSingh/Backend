import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import { protect } from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// enabling cors
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
  }),
);

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/protected", protect, (req, res) => {
  res.json({ message: "You're in", userId: req.user.id });
});

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
