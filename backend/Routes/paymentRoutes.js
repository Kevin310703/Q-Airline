import express from "express";
import { getPaymentByBookingId } from "../controller/paymentController.js";

const router = express.Router();

router.get("/payments/booking/:booking_id", getPaymentByBookingId);

export default router;