import pool from '../config/database.js';

export const SearchFlight = async (req, res) => {
    const {
        departureLocation,
        destinationLocation,
        checkIn,
        checkOut,
        seatClass,
    } = req.query;

    try {
        // Construct the SQL query with proper placeholders
        const query = `
            SELECT 
                flights.flight_id,
                flights.departure_time,
                flights.arrival_time,
                flights.status,
                departure_airport.name AS departure_airport_name,
                arrival_airport.name AS arrival_airport_name,
                airplanes.model AS airplane_model,
                airplane_seats.price AS seat_price
            FROM flights
            JOIN airports AS departure_airport ON flights.departure_airport_id = departure_airport.airport_id
            JOIN airports AS arrival_airport ON flights.arrival_airport_id = arrival_airport.airport_id
            JOIN airplanes ON flights.airplane_id = airplanes.airplane_id
            JOIN airplane_seats ON airplanes.airplane_id = airplane_seats.airplane_id
            WHERE 
                (departure_airport.city = ? OR ? IS NULL)
                AND (arrival_airport.city = ? OR ? IS NULL)
                AND (flights.departure_time >= ? OR ? IS NULL)
                AND (flights.departure_time <= ? OR ? IS NULL)
                AND (airplane_seats.seat_class = ? OR ? IS NULL)
        `;

        // Provide parameters in the correct order
        const [results] = await pool.query(query, [
            departureLocation, departureLocation,
            destinationLocation, destinationLocation,
            checkIn, checkIn,
            checkOut, checkOut,
            seatClass, seatClass,
        ]);

        // Return results or a no flights found message
        if (results.length === 0) {
            return res.status(404).json({ message: "No flights found matching your criteria." });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching flights:", error);
        res.status(500).json({ message: "Server error" });
    }
};