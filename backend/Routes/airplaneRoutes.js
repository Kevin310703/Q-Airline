import express from "express";
import { createAirplane,
    getAirplanes,
    getAirplaneById,
    getSeatsByAirplaneId,
    createSeat,
    updateSeat,
    deleteSeat,
    getAvailableSeats,
    getSeatBySeatId,
    updateAirplane,
    deleteAirplane,
    createFlight,
    getFlights,
    getFlightsByAirplaneId,
    getFlightById,
    updateFlight,
    deleteFlight,
    updateFlightDepartureTime
 } from "../controller/airplaneController.js";

const router = express.Router();

// Route máy bay
router.get("/airplanes", getAirplanes);
router.post("/airplanes", createAirplane);
router.put("/airplanes/:id", updateAirplane);
router.delete("/airplanes/:id", deleteAirplane);
router.get("/airplanes/:id", getAirplaneById);

// Route ghế ngồi trên máy bay
router.get("/airplane-seats/:airplane_id", getSeatsByAirplaneId);
router.get("/airplane-seats/seat/:seat_id", getSeatBySeatId);
router.post("/airplane-seats", createSeat);
router.put("/airplane-seats/:seat_id", updateSeat);
router.delete("/airplane-seats/:seat_id", deleteSeat);
router.get("/airplane-seats/:airplane_id/available", getAvailableSeats);

// Route chuyến bay
router.post("/airplane-flights", createFlight);
router.get("/airplane-flights", getFlights);
router.get("/airplane-flights/airplane/:airplane_id", getFlightsByAirplaneId);
router.get("/airplane-flights/:flight_id", getFlightById);
router.put("/airplane-flights/:flight_id", updateFlight);
router.delete("/airplane-flights/:flight_id", deleteFlight);
router.put("/airplane-flights/time/:flight_id", updateFlightDepartureTime);

export default router;
