import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { Link } from "react-router-dom";

const FlightsList = () => {
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const response = await axiosInstance.get("/api/airplane-flights");
                setFlights(response.data);
            } catch (error) {
                console.error("Error fetching flights:", error);
            }
        };

        fetchFlights();
    }, []);

    console.log(flights);

    return (
        <div className="flightList section">
            <div className="flightContainer container">
                <h2>Flight List</h2>
                <div className="table-wrapper">
                    <table className="flights-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Departure Airport</th>
                                <th>Arrival Airport</th>
                                <th>Departure Time</th>
                                <th>Arrival Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map((flight) => (
                                <tr key={flight.id}>
                                    <td>
                                        <Link to={`/airplane-information/${flight.airplane_id}`} className="link">
                                            {flight.airplane_registration}
                                        </Link>
                                    </td>
                                    <td>{flight.departure_airport}</td>
                                    <td>{flight.arrival_airport}</td>
                                    <td>{new Date(flight.departure_time).toLocaleString()}</td>
                                    <td>{new Date(flight.arrival_time).toLocaleString()}</td>
                                    <td>{flight.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FlightsList;
