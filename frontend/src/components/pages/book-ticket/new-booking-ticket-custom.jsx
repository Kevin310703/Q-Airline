import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosInstance";

const NewBookTicket = () => {
    const { user, dispatch, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    // Nhận dữ liệu truyền từ AirplaneDetails
    const { airplane, selectedFlights, selectedSeat } = location.state || {};

    if (!airplane || !selectedFlights || !selectedSeat) {
        return <p>No ticket information provided. Please select details again.</p>;
    }

    const handleConfirmBooking = async () => {
        try {
            await axiosInstance.post("/api/tickets-booking", {
                user_id: user.id,
                flight_id: selectedFlights.id,
                seat_number: selectedSeat.seat_number,
                seat_class: selectedSeat.seat_class,
                price: selectedSeat.price
            });
            setMessage("Booking ticket confirmed successfully!");

            window.setTimeout(() => {
                navigate("/my-ticket");
            }, 2000);
        } catch (error) {
            console.error("Error confirming ticket:", error);
            setMessage("Failed to confirm booking ticket. Please try again.");
        }
    };

    console.log(airplane);
    console.log(selectedFlights);
    console.log(selectedSeat);
    return (
        <div className="bookTicket section">
            <div className="bookTicketContainer container">
                <h2>Book Ticket</h2>

                {message && (
                    <p className={`message ${message.includes("Failed") ? "error" : "success"}`}>
                        {message}
                    </p>
                )}

                <div className="ticketDetails">
                    <div className="ticketHeader flex">
                        <div>
                            <h4>{selectedFlights.departure_city} → {selectedFlights.arrival_city}</h4>
                            <p>{new Date(selectedFlights.departure_time).toLocaleString()} - {new Date(selectedFlights.arrival_time).toLocaleString()}</p>
                        </div>
                        <p className="flightDuration">
                            Duration:
                            {(() => {
                                const durationMs = new Date(selectedFlights.arrival_time) - new Date(selectedFlights.departure_time);
                                const seconds = Math.floor((durationMs / 1000) % 60);
                                const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
                                const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
                                const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));

                                return `${days > 0 ? `${days}d ` : ""}${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
                            })()}
                        </p>
                    </div>

                    <div className="ticketContent flex">
                        <div className="flightInfo">
                            <p><strong>Airplane:</strong> {airplane.model}</p>
                            <p>
                                <strong>Seat:</strong> {selectedSeat.seat_number}
                                <span className={`seatClass ${selectedSeat.seat_class.toLowerCase()}`}>
                                    ({selectedSeat.seat_class})
                                </span>
                            </p>
                            <p><strong>Departure airport:</strong> {selectedFlights.departure_airport}, {selectedFlights.departure_city}</p>
                            <p><strong>Arrival airport:</strong> {selectedFlights.arrival_airport}, {selectedFlights.arrival_city}</p>
                        </div>
                        <div className="ticketPrice">
                            <p><strong>Total price:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedSeat.price)}</p>
                        </div>
                    </div>

                    <div className="ticketActions">
                        <button className="btn confirmBtn" onClick={handleConfirmBooking}>Confirm Booking</button>
                        <button className="btn cancelBtn" onClick={() => navigate(-1)}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewBookTicket;
