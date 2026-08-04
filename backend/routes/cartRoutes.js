import express from "express";

import {

    getCart,

    saveCart,

    clearCart

}

from "../controllers/cartController.js";

const router = express.Router();

router.get(

    "/",

    getCart

);

router.post(

    "/",

    saveCart

);

router.delete(

    "/",

    clearCart

);

export default router;