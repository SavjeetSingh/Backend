import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// enabling cors
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: `Server is running` });
});

app.listen(PORT, (req, res) => {
  res.json({ message: `Server is running on http://localhost:${PORT}` });
});
