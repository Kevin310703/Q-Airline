import express from "express";
import { SearchFlight,

 } from "../controller/searchController.js";

const router = express.Router();

router.get("/search-flights", SearchFlight);

export default router;
