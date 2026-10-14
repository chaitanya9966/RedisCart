import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";

import cartRoutes from "./routes/cartRoutes.js";

import orderRoutes from "./routes/orderRoutes.js";

import setupRoutes from "./routes/setupRoutes.js";

import "./redis.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/products", productRoutes);

app.use("/cart", cartRoutes);

app.use("/orders", orderRoutes);

app.use("/setup", setupRoutes);

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "RedisCart Backend Running"

    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Running on Port ${PORT}`);

});