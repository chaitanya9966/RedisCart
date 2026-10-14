import express from "express";

import {
    analyzeSetup
} from "../controllers/setupController.js";

const router = express.Router();

router.post(
    "/analyze",
    analyzeSetup
);

export default router;