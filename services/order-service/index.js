import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../../common/db.js";
import Order from "./order.model.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logging for order-service
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[order-service] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "order-service" });
});

// GET /orders - list all orders
app.get("/orders", async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// POST /orders - create order
app.post("/orders", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "userId, productId and quantity (>=1) are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid userId or productId" });
    }

    const order = await Order.create({ userId, productId, quantity });
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

const port = process.env.PORT_ORDERS || 3003;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Order service running on port ${port}`);
  });
});
