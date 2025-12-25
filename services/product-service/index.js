import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../../common/db.js";
import Product from "./product.model.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logging for product-service
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[product-service] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "product-service" });
});

// GET /products - list all products
app.get("/products", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// POST /products - create product
app.post("/products", async (req, res) => {
  try {
    const { title, author, price } = req.body;
    if (!title || !author || price == null) {
      return res.status(400).json({ message: "title, author and price are required" });
    }

    const product = await Product.create({ title, author, price });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create product" });
  }
});

const port = process.env.PORT_PRODUCTS || 3002;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Product service running on port ${port}`);
  });
});
