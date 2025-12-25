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

// PUT /orders/:id - update order (quantity and product/user if needed)
app.put("/orders/:id", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const { id } = req.params;

    if (!userId || !productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "userId, productId and quantity (>=1) are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid userId or productId" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { userId, productId, quantity },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order" });
  }
});

// DELETE /orders/:id - delete order
app.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

// GET /orders/:id - get single order
app.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// PUT /orders/:id - update order
app.put("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, productId, quantity } = req.body;

    if (quantity != null && quantity < 1) {
      return res.status(400).json({ message: "quantity must be >= 1" });
    }

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { userId, productId, quantity },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update ordersssss" });
  }
});

// DELETE /orders/:id - delete order
app.delete("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete order" });
  }
});

const PORT = process.env.PORT || 3003;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Order service running on port ${PORT}`);
  });
});
