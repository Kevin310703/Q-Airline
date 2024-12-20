import express from "express";
import { getAllTickets,
    addTicket,
    addTicketAndBooking,
    updateTicket,
    deleteTicket,
    getTicketById,
    cancelBooking,
    getUserBookingCount,
    getUserTickets, 
    earningCalculator,
 } from "../controller/ticketController.js";

const router = express.Router();

router.get("/tickets", getAllTickets);
router.get("/tickets/:ticket_id", getTicketById);
router.get("/tickets/booking/count/:user_id", getUserBookingCount);
router.get("/tickets/booking/user/:user_id", getUserTickets);
router.get("/tickets/booking/earnings", earningCalculator);
router.post("/tickets", addTicket);
router.post("/tickets-booking", addTicketAndBooking);
router.put("/tickets/:ticket_id", updateTicket);
router.delete("/tickets/:ticket_id", deleteTicket);
router.put("/tickets/:id/cancel", cancelBooking);

export default router;
