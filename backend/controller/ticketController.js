import pool from '../config/database.js';
import { createAnnouncement } from '../models/announcementModel.js';

// Danh sách vé
export const getAllTickets = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT 
                t.ticket_id AS id,
                t.seat_number,
                t.seat_class,
                t.price,
                b.booking_id,
                IFNULL(b.status, 'N/A') AS booking_status,
                IFNULL(b.booking_date, 'N/A') AS booking_date,
                IFNULL(u.full_name, 'N/A') AS customer_name,
                f.flight_id,
                f.departure_time,
                f.arrival_time,
                f.status AS flight_status,
                a1.name AS departure_airport,
                a1.city AS departure_city,
                a1.country AS departure_country,
                a2.name AS arrival_airport,
                a2.city AS arrival_city,
                a2.country AS arrival_country,
                ap.model AS airplane_model,
                ap.registration_number AS airplane_registration_number,
                ap.manufacturer AS airplane_manufacturer,
                ap.capacity AS airplane_capacity,
                ap.status AS airplane_status
            FROM 
                tickets t
            LEFT JOIN 
                bookings b ON t.booking_id = b.booking_id
            LEFT JOIN 
                users u ON b.user_id = u.user_id
            JOIN 
                flights f ON t.flight_id = f.flight_id
            JOIN 
                airports a1 ON f.departure_airport_id = a1.airport_id
            JOIN 
                airports a2 ON f.arrival_airport_id = a2.airport_id
            JOIN 
                airplanes ap ON f.airplane_id = ap.airplane_id
            ORDER BY 
                t.ticket_id ASC;
        `);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Thông tin vé cụ thể (lấy theo ID)
export const getTicketById = async (req, res) => {
    const { ticket_id } = req.params;

    try {
        const [result] = await pool.query(`
            SELECT 
                t.ticket_id AS id,
                t.seat_number,
                t.seat_class,
                t.price,
                IFNULL(b.status, 'N/A') AS booking_status,
                IFNULL(b.booking_date, 'N/A') AS booking_date,
                IFNULL(u.full_name, 'N/A') AS customer_name,
                f.flight_id,
                f.departure_time,
                f.arrival_time,
                f.status AS flight_status,
                a1.name AS departure_airport,
                a1.city AS departure_city,
                a1.country AS departure_country,
                a2.name AS arrival_airport,
                a2.city AS arrival_city,
                a2.country AS arrival_country,
                ap.model AS airplane_model,
                ap.registration_number AS airplane_registration_number,
                ap.manufacturer AS airplane_manufacturer,
                ap.capacity AS airplane_capacity,
                ap.status AS airplane_status
            FROM 
                tickets t
            LEFT JOIN 
                bookings b ON t.booking_id = b.booking_id
            LEFT JOIN 
                users u ON b.user_id = u.user_id
            JOIN 
                flights f ON t.flight_id = f.flight_id
            JOIN 
                airports a1 ON f.departure_airport_id = a1.airport_id
            JOIN 
                airports a2 ON f.arrival_airport_id = a2.airport_id
            JOIN 
                airplanes ap ON f.airplane_id = ap.airplane_id
            WHERE 
                t.ticket_id = ?
        `, [ticket_id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error fetching ticket by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Tạo (thêm) vé
export const addTicket = async (req, res) => {
    const { flight_id, seat_number, seat_class, price } = req.body;

    console.log(flight_id, seat_number, seat_class, price);

    try {
        const [ticketResult] = await pool.query(
            `
            INSERT INTO tickets (flight_id, seat_number, seat_class, price)
            VALUES (?, ?, ?, ?)
            `,
            [flight_id, seat_number, seat_class, price]
        );

        // Trả về kết quả
        res.status(200).json({
            message: "Ticket created successfully",
            ticket_id: ticketResult.insertId,
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const addTicketAndBooking = async (req, res) => {
    const { user_id, flight_id, seat_number, seat_class, price } = req.body;

    try {
        // Truy vết thông tin chuyến bay và máy bay
        const [flightInfo] = await pool.query(
            `
            SELECT 
                f.departure_time, 
                f.arrival_time,
                a1.name AS departure_airport,
                a1.city AS departure_city,
                a2.name AS arrival_airport,
                a2.city AS arrival_city,
                ap.model AS airplane_model,
                ap.registration_number AS airplane_registration
            FROM 
                flights f
            JOIN 
                airports a1 ON f.departure_airport_id = a1.airport_id
            JOIN 
                airports a2 ON f.arrival_airport_id = a2.airport_id
            JOIN 
                airplanes ap ON f.airplane_id = ap.airplane_id
            WHERE 
                f.flight_id = ?
            `,
            [flight_id]
        );

        if (flightInfo.length === 0) {
            return res.status(404).json({ message: "Flight not found" });
        }

        const {
            departure_time,
            arrival_time,
            departure_airport,
            departure_city,
            arrival_airport,
            arrival_city,
            airplane_model,
            airplane_registration,
        } = flightInfo[0];

        // Tạo booking
        const [bookingResult] = await pool.query(
            `
        INSERT INTO bookings (user_id, flight_id, booking_date, status)
        VALUES (?, ?, NOW(), 'Confirmed')
        `,
            [user_id, flight_id]
        );
        const booking_id = bookingResult.insertId;

        // Kiểm tra ghế đã được đặt hay chưa
        const [seatCheck] = await pool.query(
            `
        SELECT is_occupied FROM airplane_seats 
        WHERE seat_number = ? AND airplane_id = (SELECT airplane_id FROM flights WHERE flight_id = ?)
        `,
            [seat_number, flight_id]
        );

        if (seatCheck.length > 0 && seatCheck[0].is_occupied) {
            return res.status(400).json({ message: "Seat already occupied" });
        }

        // Tạo ticket
        const [ticketResult] = await pool.query(
            `
        INSERT INTO tickets (booking_id, flight_id, seat_number, price, seat_class)
        VALUES (?, ?, ?, ?, ?)
        `,
            [booking_id, flight_id, seat_number, price, seat_class]
        );

        // Cập nhật trạng thái ghế
        await pool.query(
            `
        UPDATE airplane_seats
        SET is_occupied = true, passenger_id = ?
        WHERE seat_number = ? AND airplane_id = (SELECT airplane_id FROM flights WHERE flight_id = ?)
        `,
            [user_id, seat_number, flight_id]
        );

        const title = "Ticket Booking Confirmation";
        const content = `
            Your ticket for flight ${airplane_model} (Registration: ${airplane_registration})
            departing from ${departure_airport}, ${departure_city} to ${arrival_airport}, ${arrival_city}
            has been successfully booked. Seat Number: ${seat_number}, Class: ${seat_class}.
            Departure Time: ${new Date(departure_time).toLocaleString()}, Arrival Time: ${new Date(arrival_time).toLocaleString()}.
        `;

        await createAnnouncement({
            title,
            content,
            user_ids: [user_id],
            sender_id: null, // Hệ thống gửi
        });

        res.status(201).json({
            message: "Ticket created successfully",
            ticket_id: ticketResult.insertId,
            booking_id,
        });
    } catch (error) {
        console.error("Error adding ticket:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Cập nhật thông tin vé
export const updateTicket = async (req, res) => {
    const { ticket_id } = req.params;
    const { seat_number, price } = req.body;

    try {
        const [result] = await pool.query(`
            UPDATE tickets
            SET seat_number = ?, price = ?
            WHERE ticket_id = ?
        `, [seat_number, price, ticket_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({ message: "Ticket updated successfully" });
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Xóa vé
export const deleteTicket = async (req, res) => {
    const { ticket_id } = req.params;

    try {
        const [result] = await pool.query(`
            DELETE FROM tickets WHERE ticket_id = ?
        `, [ticket_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Hủy đặt vé
export const cancelBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const [bookingInfo] = await pool.query(
            `
            SELECT 
                b.user_id, 
                b.flight_id, 
                f.departure_time, 
                f.arrival_time, 
                a1.name AS departure_airport,
                a1.city AS departure_city,
                a2.name AS arrival_airport,
                a2.city AS arrival_city,
                ap.model AS airplane_model,
                ap.registration_number AS airplane_registration
            FROM 
                bookings b
            JOIN 
                flights f ON b.flight_id = f.flight_id
            JOIN 
                airports a1 ON f.departure_airport_id = a1.airport_id
            JOIN 
                airports a2 ON f.arrival_airport_id = a2.airport_id
            JOIN 
                airplanes ap ON f.airplane_id = ap.airplane_id
            WHERE 
                b.booking_id = ?
            `,
            [id]
        );

        if (bookingInfo.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const {
            user_id,
            departure_time,
            arrival_time,
            departure_airport,
            departure_city,
            arrival_airport,
            arrival_city,
            airplane_model,
            airplane_registration,
        } = bookingInfo[0];

        const [result] = await pool.query(
            `
            UPDATE bookings
            SET status = 'Canceled'
            WHERE booking_id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await pool.query(
            `
            UPDATE airplane_seats AS seats
            JOIN tickets AS t ON seats.seat_number = t.seat_number
            SET seats.is_occupied = false, seats.passenger_id = NULL
            WHERE t.booking_id = ?
            `,
            [id]
        );

        const title = "Booking Cancellation";
        const content = `
            Your booking for flight ${airplane_model} (Registration: ${airplane_registration}) 
            departing from ${departure_airport}, ${departure_city} 
            to ${arrival_airport}, ${arrival_city} 
            has been successfully canceled. Departure Time: ${new Date(departure_time).toLocaleString()}, 
            Arrival Time: ${new Date(arrival_time).toLocaleString()}.
        `;

        await createAnnouncement({
            title,
            content,
            user_ids: [user_id],
            sender_id: null, // Hệ thống gửi
        });

        res.status(200).json({ message: "Booking canceled successfully" });
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Số lượng vé của người dùng
export const getUserBookingCount = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [result] = await pool.query(
            `SELECT COUNT(*) AS bookingCount 
             FROM bookings 
             WHERE user_id = ? AND status = 'Confirmed'`,
            [user_id]
        );

        res.status(200).json({ bookingCount: result[0].bookingCount });
    } catch (error) {
        console.error("Error fetching user booking count:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUserTickets = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [tickets] = await pool.query(
            `SELECT 
                t.ticket_id AS id,
                t.seat_number,
                t.seat_class,
                t.price,
                f.departure_time,
                f.arrival_time,
                f.status AS flight_status,
                b.status AS booking_status,
                a1.name AS departure_airport,
                a1.city AS departure_city,
                a1.country AS departure_country,
                a2.name AS arrival_airport,
                a2.city AS arrival_city,
                a2.country AS arrival_country,
                ap.model AS airplane_model
            FROM 
                tickets t
            JOIN 
                bookings b ON t.booking_id = b.booking_id
            JOIN 
                flights f ON t.flight_id = f.flight_id
            JOIN 
                airports a1 ON f.departure_airport_id = a1.airport_id
            JOIN 
                airports a2 ON f.arrival_airport_id = a2.airport_id
            JOIN 
                airplanes ap ON f.airplane_id = ap.airplane_id
            WHERE 
                b.user_id = ?
            ORDER BY 
                b.booking_date DESC, t.ticket_id DESC`,
            [user_id]
        );

        res.status(200).json(tickets);
    } catch (error) {
        console.error("Error fetching user tickets:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const earningCalculator = async (req, res) => {
    try {
        // Thực hiện truy vấn
        const [rows] = await pool.query(`
            SELECT SUM(t.price) as total 
            FROM tickets t
            JOIN bookings b ON t.booking_id = b.booking_id
            WHERE b.status = 'Confirmed'
        `);

        // Kiểm tra nếu không có kết quả
        if (rows.length === 0) {
            return res.status(404).json({ message: "Không có dữ liệu earnings" });
        }

        // Lấy tổng earnings
        const totalEarnings = rows[0].total || 0; // Đảm bảo không bị null hoặc undefined

        // Tính toán % thay đổi (ví dụ bạn cần thêm logic thực tế)
        const percentageChange = 10;

        // Trả về kết quả
        res.status(200).json({ total: totalEarnings, percentageChange });
    } catch (error) {
        console.error("Error calculating earnings:", error);
        res.status(500).json({ message: "Error calculating earnings" });
    }
};

