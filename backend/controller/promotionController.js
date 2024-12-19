import pool from "../config/database.js";

// Lấy danh sách khuyến mãi
export const getAllPromotions = async (req, res) => {
    try {
        const query = `
            SELECT 
                promotion_id AS id, 
                title, 
                description, 
                start_date, 
                end_date, 
                discount_percentage, 
                image_url, 
                destination, 
                price, 
                valid_period, 
                created_at 
            FROM promotions 
            ORDER BY promotion_id ASC
        `;
        const [promotions] = await pool.query(query);
        res.status(200).json(promotions);
    } catch (error) {
        console.error("Error fetching promotions:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Lấy thông tin khuyến mãi theo id
export const getPromotionById = async (req, res) => {
    const { id } = req.params;

    try {
        const [promotion] = await pool.query(
            `
            SELECT 
                promotion_id AS id, 
                title, 
                description, 
                destination, 
                price, 
                discount_percentage, 
                valid_period, 
                start_date, 
                end_date, 
                image_url, 
                created_at 
            FROM promotions 
            WHERE promotion_id = ?
            `,
            [id]
        );

        if (promotion.length === 0) {
            return res.status(404).json({ message: "Promotion not found" });
        }

        res.status(200).json(promotion[0]);
    } catch (error) {
        console.error("Error fetching promotion by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Tạo mới khuyến mãi
export const createPromotion = async (req, res) => {
    const { title, description, start_date, end_date, discount_percentage, image_url, destination, price, valid_period } = req.body;

    try {
        const [result] = await pool.query(
            `
            INSERT INTO promotions 
            (title, description, start_date, end_date, discount_percentage, image_url, destination, price, valid_period)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [title, description, start_date, end_date, discount_percentage, image_url, destination, price, valid_period]
        );

        res.status(201).json({ message: "Promotion created successfully", promotion_id: result.insertId });
    } catch (error) {
        console.error("Error creating promotion:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Cập nhật khuyến mãi
export const updatePromotion = async (req, res) => {
    const { id } = req.params;
    const { title, description, start_date, end_date, discount_percentage, image_url, destination, price, valid_period } = req.body;

    try {
        const [result] = await pool.query(
            `
            UPDATE promotions
            SET title = ?, description = ?, start_date = ?, end_date = ?, discount_percentage = ?, 
                image_url = ?, destination = ?, price = ?, valid_period = ?
            WHERE promotion_id = ?
            `,
            [title, description, start_date, end_date, discount_percentage, image_url, destination, price, valid_period, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Promotion not found" });
        }

        res.status(200).json({ message: "Promotion updated successfully" });
    } catch (error) {
        console.error("Error updating promotion:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Xóa khuyến mãi
export const deletePromotion = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query("DELETE FROM promotions WHERE promotion_id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Promotion not found" });
        }

        res.status(200).json({ message: "Promotion deleted successfully" });
    } catch (error) {
        console.error("Error deleting promotion:", error);
        res.status(500).json({ message: "Server error" });
    }
};
