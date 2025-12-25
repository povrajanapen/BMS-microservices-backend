import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../../common/db.js";
import User from "./user.model.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "user-service" });
});

// GET /users - list all users
app.get("/users", async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// POST /users - create user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "name and email are required" });
    }

    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Failed to create user" });
  }
});

const port = process.env.PORT_USERS || 3001;

const seedDefaultUser = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create({
        name: "Demo User",
        email: "demo@example.com",
      });
      console.log("Seeded default user: demo@example.com");
    }
  } catch (err) {
    console.error("Failed to seed default user", err);
  }
};

connectDB()
  .then(async () => {
    await seedDefaultUser();
    app.listen(port, () => {
      console.log(`User service running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start user service", err);
  });
