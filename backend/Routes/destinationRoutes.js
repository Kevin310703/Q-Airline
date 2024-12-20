import express from "express";
import {
    getAllDestinations,
    getDestinationById,
    addDestination,
    updateDestination,
    deleteDestination,
} from "../controller/destinationController.js";

const router = express.Router();

router.get("/destinations", getAllDestinations);
router.get("/destinations/:id", getDestinationById);
router.post("/destinations", addDestination);
router.put("/destinations/:id", updateDestination);
router.delete("/destinations/:id", deleteDestination);

export default router;
