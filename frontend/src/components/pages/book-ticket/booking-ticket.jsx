import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";

const BookTicket = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const res = await axiosInstance.get(`/api/tickets/${id}`);
                setTicket(res.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch ticket details. Please try again later.");
                setLoading(false);
            }
        };

        fetchTicketDetails();
    }, [id]);

    const handleConfirmBooking = async () => {
        try {
            await axiosInstance.post(`/api/confirm-booking`, { ticketId: id });
            alert("Booking confirmed successfully!");
            navigate("/tickets"); // Redirect to ticket list or another page
        } catch (err) {
            alert("Failed to confirm booking. Please try again.");
        }
    };

    if (loading) {
        return <p>Loading ticket details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    console.log(ticket);

    return (
        <div className="bookTicket section">
            <div className="bookTicketContainer container">
                <h2>Book Ticket</h2>
                {ticket ? (
                    <div className="ticketDetails">
                        <div className="ticketHeader flex">
                            <div>
                                <h4>{ticket.departure_city} → {ticket.arrival_city}</h4>
                                <p>{new Date(ticket.departure_time).toLocaleString()} - {new Date(ticket.arrival_time).toLocaleString()}</p>
                            </div>
                            <p className="flightDuration">
                                Duration:
                                {(() => {
                                    const durationMs = new Date(ticket.arrival_time) - new Date(ticket.departure_time);
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
                                <p><strong>Airplane:</strong> {ticket.airplane_model}</p>
                                <p>
                                    <strong>Seat:</strong> {ticket.seat_number}
                                    <span className={`seatClass ${ticket.seat_class.toLowerCase()}`}>
                                        ({ticket.seat_class})
                                    </span>
                                </p>
                                <p><strong>Departure airport:</strong> {ticket.departure_airport}, {ticket.departure_country}</p>
                                <p><strong>Arrival:</strong> {ticket.arrival_airport}, {ticket.arrival_country}</p>
                            </div>
                            <div className="ticketPrice">
                                <p><strong>Total price:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ticket.price)}</p>
                            </div>
                        </div>
                        <div className="ticketActions flex">
                            <button className="btn confirmBtn" onClick={handleConfirmBooking}>Confirm Booking</button>
                            <button className="btn cancelBtn" onClick={() => navigate(-1)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <p>Ticket not found.</p>
                )}
            </div>
        </div>
    );
};

export default BookTicket;
