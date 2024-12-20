import pool from '../config/database.js';

export const getAllDestinations = async (req, res) => {
    try {
        const [destinations] = await pool.query(`
            SELECT 
                destination_id AS id, 
                name, 
                description, 
                latitude, 
                longitude, 
                image_url, 
                created_at 
            FROM destinations 
            ORDER BY destination_id ASC
        `);
        res.status(200).json(destinations);
    } catch (error) {
        console.error("Error fetching destinations:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getDestinationById = async (req, res) => {
    const { id } = req.params;

    try {
        const [destination] = await pool.query(`
            SELECT 
                destination_id AS id, 
                name, 
                description, 
                latitude, 
                longitude, 
                image_url, 
                created_at 
            FROM destinations 
            WHERE destination_id = ?
        `, [id]);

        if (destination.length === 0) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json(destination[0]);
    } catch (error) {
        console.error("Error fetching destination by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const addDestination = async (req, res) => {
    const { name, description, image_url, latitude, longitude } = req.body;

    try {
        const [result] = await pool.query(
            "INSERT INTO destinations (name, description, image_url, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
            [name, description, image_url, latitude, longitude]
        );
        res.status(201).json({ message: "Destination added successfully", destination_id: result.insertId });
    } catch (error) {
        console.error("Error adding destination:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateDestination = async (req, res) => {
    const { id } = req.params;
    const { name, description, image_url, latitude, longitude } = req.body;

    try {
        const [result] = await pool.query(
            "UPDATE destinations SET name = ?, description = ?, image_url = ?, latitude = ?, longitude = ?, updated_at = CURRENT_TIMESTAMP WHERE destination_id = ?",
            [name, description, image_url, latitude, longitude, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json({ message: "Destination updated successfully" });
    } catch (error) {
        console.error("Error updating destination:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteDestination = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query("DELETE FROM destinations WHERE destination_id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json({ message: "Destination deleted successfully" });
    } catch (error) {
        console.error("Error deleting destination:", error);
        res.status(500).json({ message: "Server error" });
    }
};
