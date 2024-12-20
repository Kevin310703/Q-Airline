import pool from '../config/database.js';

export const getAllBookings = async (req, res) => {
    try {
        const [bookings] = await pool.query(`
            SELECT 
                b.booking_id AS id,
                u.full_name AS customer_name,
                u.email AS customer_email,
                f.departure_time,
                f.arrival_time,
                dep_airport.name AS departure_airport,
                arr_airport.name AS arrival_airport,
                ap.model AS airplane_model,
                ap.registration_number AS airplane_registration,
                t.seat_number AS seat_number,
                t.seat_class AS seat_class,
                t.price,
                b.booking_date,
                b.status
            FROM 
                bookings b
            JOIN 
                users u ON b.user_id = u.user_id
            JOIN 
                flights f ON b.flight_id = f.flight_id
            JOIN 
                tickets t ON b.booking_id = t.booking_id
            JOIN 
                airports dep_airport ON f.departure_airport_id = dep_airport.airport_id
            JOIN 
                airports arr_airport ON f.arrival_airport_id = arr_airport.airport_id
            JOIN 
                airplanes ap ON f.airplane_id = ap.airplane_id
            ORDER BY 
                b.booking_date DESC
        `);

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getBookingsByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [bookings] = await pool.query(`
            SELECT 
                b.booking_id AS id,
                f.departure_time,
                f.arrival_time,
                dep_airport.name AS departure_airport,
                arr_airport.name AS arrival_airport,
                ap.model AS airplane_model,
                ap.registration_number AS airplane_registration,
                t.seat_number AS seat_number,
                t.seat_class AS seat_class,
                b.booking_date,
                b.status
            FROM 
                bookings b
            JOIN 
                flights f ON b.flight_id = f.flight_id
            JOIN 
                tickets t ON b.booking_id = t.booking_id
            JOIN 
                airports dep_airport ON f.departure_airport_id = dep_airport.airport_id
            JOIN 
                airports arr_airport ON f.arrival_airport_id = arr_airport.airport_id
            JOIN 
                airplanes ap ON f.airplane_id = ap.airplane_id
            WHERE 
                b.user_id = ?
            ORDER BY 
                b.booking_date DESC
        `, [user_id]);

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Server error" });
    }
};