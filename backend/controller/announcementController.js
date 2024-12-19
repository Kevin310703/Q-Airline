import pool from '../config/database.js';

export const getAllAnnouncements = async (req, res) => {
    try {
        const [announcements] = await pool.query(`
            SELECT 
                a.announcement_id AS id,
                a.title,
                a.content,
                a.created_at,
                a.sender_id,
                u.full_name AS sender_name,
                ua.user_id,
                ua.is_read
            FROM 
                announcements a
            LEFT JOIN 
                user_announcements ua ON a.announcement_id = ua.announcement_id
            LEFT JOIN 
                users u ON a.sender_id = u.user_id
            ORDER BY 
                a.created_at DESC
        `);

        res.status(200).json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAnnouncementById = async (req, res) => {
    const { announcement_id } = req.params;

    try {
        const [announcement] = await pool.query(
            `SELECT 
                a.announcement_id AS id,
                a.title,
                a.content,
                a.created_at,
                a.sender_id,
                u.full_name AS sender_name,
                ua.user_id,
                ua.is_read
            FROM 
                announcements a
            LEFT JOIN 
                user_announcements ua ON a.announcement_id = ua.announcement_id
            LEFT JOIN 
                users u ON a.sender_id = u.user_id
            WHERE 
                a.announcement_id = ?`,
            [announcement_id]
        );

        if (announcement.length === 0) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json(announcement[0]);
    } catch (error) {
        console.error("Error fetching announcement:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserAnnouncements = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [notifications] = await pool.query(
            `SELECT 
                ua.id AS user_notification_id,
                a.announcement_id,
                a.title,
                a.content,
                ua.is_read,
                a.created_at
            FROM 
                user_announcements ua
            JOIN 
                announcements a ON ua.announcement_id = a.announcement_id
            WHERE 
                ua.user_id = ?
            ORDER BY 
                a.created_at DESC`,
            [user_id]
        );

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching user notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Tạo thông báo
export const createAnnouncement = async (req, res) => {
    const { title, content, user_ids, sender_id } = req.body;
    try {
        const [announcementResult] = await pool.query(
            `INSERT INTO announcements (title, content, sender_id) VALUES (?, ?, ?)`,
            [title, content, sender_id]
        );

        const announcementId = announcementResult.insertId;
        const userNotifications = user_ids.map((user_id) => [user_id, announcementId]);
        await pool.query(
            `INSERT INTO user_announcements (user_id, announcement_id) VALUES ?`,
            [userNotifications]
        );

        res.status(200).json({ message: "Announcement created and sent successfully." });
    } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Đánh dấu đã đọc thông báo 
export const markAnnouncementsAsRead = async (req, res) => {
    const { user_notification_id } = req.params;

    try {
        await pool.query(
            `UPDATE user_announcements 
             SET is_read = TRUE 
             WHERE id = ?`,
            [user_notification_id]
        );

        res.status(200).json({ message: "Notification marked as read." });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Xóa thông báo
export const deleteAnnouncement = async (req, res) => {
    const { announcement_id } = req.params;

    try {
        await pool.query(
            `DELETE FROM user_announcements WHERE announcement_id = ?`,
            [announcement_id]
        );

        const [result] = await pool.query(
            `DELETE FROM announcements WHERE announcement_id = ?`,
            [announcement_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ message: "Server error" });
    }
};
