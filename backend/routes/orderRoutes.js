import express from "express";

import {

    placeOrder,

    getOrders

}

from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);

router.post("/", placeOrder);

export default router;