import pool from '../config/database.js';

// Tạo máy bay
export const createAirplane = async (req, res) => {
    const {
        model,
        manufacturer,
        year_of_manufacture,
        registration_number,
        fuel_capacity,
        last_inspection_date,
        capacity,
        status,
        avatar
    } = req.body;

    try {
        // Kiểm tra xem `registration_number` đã tồn tại chưa
        const [existingAirplane] = await pool.query(
            "SELECT * FROM airplanes WHERE registration_number = ?",
            [registration_number]
        );

        if (existingAirplane.length > 0) {
            return res.status(400).json({
                message: "Registration number already exists.",
            });
        }

        // Tạo mới máy bay
        const [result] = await pool.query(
            `INSERT INTO airplanes (
            model, manufacturer, year_of_manufacture, 
            registration_number, fuel_capacity, last_inspection_date, 
            capacity, status, avatar, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                model,
                manufacturer,
                year_of_manufacture,
                registration_number,
                fuel_capacity,
                last_inspection_date || null,
                capacity,
                status || "active",
                avatar
            ]
        );

        res.status(201).json({
            message: "Airplane created successfully.",
            airplaneId: result.insertId,
        });
    } catch (error) {
        console.error("Error creating airplane:", error);
        res.status(500).json({
            message: "Server error. Could not create airplane.",
        });
    }
};

// Danh sách máy bay
export const getAirplanes = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
          airplane_id AS id,
          model,
          manufacturer,
          year_of_manufacture,
          registration_number,
          fuel_capacity,
          last_inspection_date,
          capacity,
          status,
          avatar,
          created_at,
          updated_at
        FROM airplanes`
        );
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching airplanes:", err);
        res.status(500).json({ message: "Server error." });
    }
};

// Cập nhật thông tin máy bay
export const updateAirplane = async (req, res) => {
    const { id } = req.params;
    const {
        model,
        manufacturer,
        year_of_manufacture,
        capacity,
        status,
        registration_number,
        fuel_capacity,
        last_inspection_date,
        avatar,
    } = req.body;

    try {
        // Kiểm tra xem máy bay có tồn tại không
        const [existingAirplane] = await pool.query(
            "SELECT * FROM airplanes WHERE airplane_id = ?",
            [id]
        );

        if (existingAirplane.length === 0) {
            return res.status(404).json({ message: "Airplane not found." });
        }

        // Cập nhật thông tin máy bay
        await pool.query(
            `
        UPDATE airplanes 
        SET 
          model = ?, 
          manufacturer = ?, 
          year_of_manufacture = ?, 
          capacity = ?, 
          status = ?, 
          registration_number = ?, 
          fuel_capacity = ?, 
          last_inspection_date = ?, 
          avatar = ?, 
          updated_at = CURRENT_TIMESTAMP
        WHERE airplane_id = ?
        `,
            [
                model || existingAirplane[0].model,
                manufacturer || existingAirplane[0].manufacturer,
                year_of_manufacture || existingAirplane[0].year_of_manufacture,
                capacity || existingAirplane[0].capacity,
                status || existingAirplane[0].status,
                registration_number || existingAirplane[0].registration_number,
                fuel_capacity || existingAirplane[0].fuel_capacity,
                last_inspection_date || existingAirplane[0].last_inspection_date,
                avatar || existingAirplane[0].avatar,
                id,
            ]
        );

        // Lấy lại dữ liệu sau khi cập nhật
        const [updatedAirplane] = await pool.query(
            "SELECT * FROM airplanes WHERE airplane_id = ?",
            [id]
        );

        res.status(200).json({
            message: "Airplane updated successfully.",
            data: updatedAirplane[0],
        });
    } catch (error) {
        console.error("Error updating airplane:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Xóa máy bay
export const deleteAirplane = async (req, res) => {
    const { id } = req.params;

    try {
        // Kiểm tra sự tồn tại của máy bay
        const [existingAirplane] = await pool.query(
            "SELECT * FROM airplanes WHERE airplane_id = ?",
            [id]
        );

        if (existingAirplane.length === 0) {
            return res.status(404).json({ message: "Airplane not found." });
        }

        // Xóa máy bay
        await pool.query("START TRANSACTION");
        await pool.query("DELETE FROM airplane_seats WHERE airplane_id = ?", [id]);
        await pool.query("DELETE FROM airplanes WHERE airplane_id = ?", [id]);
        await pool.query("COMMIT");

        res.status(200).json({ message: "Airplane deleted successfully." });
    } catch (error) {
        console.error("Error deleting airplane:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// Thông tin máy bay theo id
export const getAirplaneById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT 
          airplane_id AS id,
          model,
          manufacturer,
          year_of_manufacture,
          registration_number,
          fuel_capacity,
          last_inspection_date,
          capacity,
          status,
          avatar,
          created_at,
          updated_at
        FROM airplanes
        WHERE airplane_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Airplane not found." });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error("Error fetching airplane by ID:", err);
        res.status(500).json({ message: "Server error." });
    }
};

// Danh sách ghế ngồi theo máy bay
export const getSeatsByAirplaneId = async (req, res) => {
    const { airplane_id } = req.params;

    try {
        const [seats] = await pool.query(
            `
            SELECT 
              seat_id,
              seat_number, 
              seat_class, 
              rows_number,
              is_occupied, 
              passenger_id, 
              price, 
              notes,
              created_at, 
              updated_at
            FROM airplane_seats 
            WHERE airplane_id = ?
            ORDER BY FIELD(seat_class, 'Business', 'First', 'Economy'), seat_number
            `,
            [airplane_id]
        );

        if (seats.length === 0) {
            return res.status(404).json({ message: "Seat of airplane not found." });
        }

        res.status(200).json(seats);
    } catch (error) {
        console.error("Error fetching seats:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Thông tin ghế ngồi cụ thể
export const getSeatBySeatId = async (req, res) => {
    const { seat_id } = req.params;

    try {
        const [seats] = await pool.query(
            `
            SELECT 
              seat_id,
              airplane_id,
              seat_number, 
              seat_class, 
              rows_number,
              is_occupied, 
              passenger_id, 
              price, 
              notes,
              created_at, 
              updated_at
            FROM airplane_seats 
            WHERE seat_id = ?
            `,
            [seat_id]
        );

        if (seats.length === 0) {
            return res.status(404).json({ message: "Seat not found." });
        }

        res.status(200).json(seats[0]);
    } catch (error) {
        console.error("Error fetching seat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Tạo ghế mới cho máy bay
export const createSeat = async (req, res) => {
    const { airplane_id, seat_number, seat_class, rows_number, price, notes } = req.body;

    try {
        const [result] = await pool.query(
            `
        INSERT INTO airplane_seats (
          airplane_id, 
          seat_number, 
          seat_class, 
          rows_number, 
          price, 
          notes
        ) VALUES (?, ?, ?, ?, ?, ?)`,
            [airplane_id, seat_number, seat_class, rows_number, price, notes || null]
        );

        res.status(201).json({ message: "Seat added successfully", seat_id: result.insertId });
    } catch (error) {
        console.error("Error adding seat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Cập nhật thông tin ghế ngồi
export const updateSeat = async (req, res) => {
    const { seat_id } = req.params;
    const { seat_number, seat_class, rows_number, is_occupied, passenger_id, price, notes } = req.body;

    try {
        await pool.query(
            `
        UPDATE airplane_seats
        SET 
          seat_number = ?, 
          seat_class = ?, 
          rows_number = ?, 
          is_occupied = ?, 
          passenger_id = ?, 
          price = ?, 
          notes = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE seat_id = ?`,
            [seat_number, seat_class, rows_number, is_occupied, passenger_id || null, price, notes || null, seat_id]
        );

        res.status(200).json({ message: "Seat updated successfully" });
    } catch (error) {
        console.error("Error updating seat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Xóa ghế ngồi
export const deleteSeat = async (req, res) => {
    const { seat_id } = req.params;

    try {
        await pool.query(
            "DELETE FROM airplane_seats WHERE seat_id = ?",
            [seat_id]
        );

        res.status(200).json({ message: "Seat deleted successfully" });
    } catch (error) {
        console.error("Error deleting seat:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Danh sách ghế trống
export const getAvailableSeats = async (req, res) => {
    const { airplane_id } = req.params;

    try {
        const [seats] = await pool.query(
            `
        SELECT 
          seat_id, 
          seat_number, 
          seat_class, 
          rows_number, 
          price 
        FROM airplane_seats 
        WHERE airplane_id = ? AND is_occupied = FALSE
        ORDER BY rows_number, seat_class, seat_number
        `,
            [airplane_id]
        );

        res.status(200).json(seats);
    } catch (error) {
        console.error("Error fetching available seats:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Tạo chuyến bay
export const createFlight = async (req, res) => {
    const {
        airplane_id,
        departure_airport_id,
        arrival_airport_id,
        departure_time,
        arrival_time,
        ticket_price,
        status = "Scheduled"
    } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO flights (
                airplane_id,
                departure_airport_id,
                arrival_airport_id,
                departure_time,
                arrival_time,
                ticket_price,
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                airplane_id,
                departure_airport_id,
                arrival_airport_id,
                departure_time,
                arrival_time,
                ticket_price,
                status
            ]
        );

        res.status(200).json({ message: "Flight created successfully!", flight_id: result.insertId });
    } catch (error) {
        console.error("Error creating flight:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Danh sách chuyến bay
export const getFlights = async (req, res) => {
    try {
        const [flights] = await pool.query(`
            SELECT 
                flight_id,
                airplane_id,
                departure_airport_id,
                arrival_airport_id,
                departure_time,
                arrival_time,
                ticket_price,
                status
            FROM flights
        `);

        res.status(200).json(flights);
    } catch (error) {
        console.error("Error fetching flights:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Thông tin chuyến bay cụ thể (lấy theo id)
export const getFlightById = async (req, res) => {
    const { id } = req.params;

    try {
        const [flights] = await pool.query(`
            SELECT 
                flight_id,
                airplane_id,
                departure_airport_id,
                arrival_airport_id,
                departure_time,
                arrival_time,
                ticket_price,
                status
            FROM flights
            WHERE flight_id = ?
        `, [id]);

        if (flights.length === 0) {
            return res.status(404).json({ message: "Flight not found." });
        }

        res.status(200).json(flights[0]);
    } catch (error) {
        console.error("Error fetching flight:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Cập nhật thông tin chuyến bay
export const updateFlight = async (req, res) => {
    const { id } = req.params;
    const { departure_time, arrival_time, status } = req.body;

    try {
        const [result] = await pool.query(
            `UPDATE flights
            SET departure_time = ?, arrival_time = ?, status = ?
            WHERE flight_id = ?`,
            [departure_time, arrival_time, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Flight not found." });
        }

        res.status(200).json({ message: "Flight updated successfully!" });
    } catch (error) {
        console.error("Error updating flight:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Xóa chuyến bay
export const deleteFlight = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query(
            `DELETE FROM flights WHERE flight_id = ?`, [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Flight not found." });
        }

        res.status(200).json({ message: "Flight deleted successfully!" });
    } catch (error) {
        console.error("Error deleting flight:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Thay đổi giờ khởi hành (delay) cho chuyến bay
export const updateFlightDepartureTime = async (req, res) => {
    const { flight_id } = req.params;
    const { new_departure_time } = req.body;

    try {
        const [result] = await pool.query(
            "UPDATE flights SET departure_time = ?, status = 'delayed' WHERE flight_id = ?",
            [new_departure_time, flight_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Flight not found" });
        }

        res.status(200).json({ message: "Flight departure time updated successfully" });
    } catch (error) {
        console.error("Error updating flight departure time:", error);
        res.status(500).json({ message: "Server error" });
    }
};