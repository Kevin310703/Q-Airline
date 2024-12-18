import express from 'express';
import {
    getAllAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    getUserAnnouncements,
    markAnnouncementsAsRead,
    deleteAnnouncement,
} from '../controller/announcementController.js';

const router = express.Router();

router.get("/announcements", getAllAnnouncements);
router.get("/announcements/:announcement_id", getAnnouncementById);
router.get("/announcements/user/:user_id", getUserAnnouncements);
router.post("/announcements", createAnnouncement);
router.put("/announcements/mark-read/:user_notification_id", markAnnouncementsAsRead);
router.delete("/announcements/:announcement_id", deleteAnnouncement);
export default router;
