import pool from '../config/database.js';

export const createAnnouncement = async ({ title, content, user_ids, sender_id }) => {
    if (!title || !content || !user_ids || user_ids.length === 0) {
        throw new Error("Missing required fields for creating an announcement");
    }

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

        return { message: "Announcement created and sent successfully." };
    } catch (error) {
        console.error("Error creating announcement:", error);
        throw new Error("Failed to create announcement");
    }
};
