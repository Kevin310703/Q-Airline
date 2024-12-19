import express from 'express';
import {
    getAllPromotions,
    getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion,
} from '../controller/promotionController.js';

const router = express.Router();

router.get("/promotions", getAllPromotions);
router.get("/promotions/:id", getPromotionById);
router.post("/promotions", createPromotion);
router.put("/promotions/:id", updatePromotion);
router.delete("/promotions/:id", deletePromotion);

export default router;
