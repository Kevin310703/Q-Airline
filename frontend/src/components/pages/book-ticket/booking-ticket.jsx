import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axiosInstance from "../../config/axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const BookTicket = () => {
    const { id } = useParams();
    const { user, dispatch, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const res = await axiosInstance.get(`/api/tickets/${id}`);
                setTicket(res.data);
                setLoading(false);
            } catch (err) {
                setMessage("Failed to fetch ticket details. Please try again later.");
                setLoading(false);
            }
        };

        fetchTicketDetails();
    }, [id]);

    const handleConfirmBooking = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            await axiosInstance.post("/api/tickets-booking", {
                user_id: user.id,
                flight_id: ticket.flight_id,
                seat_number: ticket.seat_number,
                seat_class: ticket.seat_class,
                price: ticket.price
            });

            setMessage("Booking ticket confirmed successfully!");

            window.setTimeout(() => {
                navigate("/my-ticket");
            }, 2000);
        } catch (err) {
            console.log(err);
            setMessage("Failed to confirm booking ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading ticket details...</p>;
    }

    console.log(ticket);

    return (
        <div className="bookTicket section">
            <div className="bookTicketContainer container">
                <h2>Book Ticket</h2>

                {message && (
                    <p className={`message ${message.includes("Failed") ? "error" : "success"}`}>
                        {message}
                    </p>
                )}

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
                            <button className="btn confirmBtn" onClick={handleConfirmBooking}>
                                {isSubmitting ? "Confirming..." : " Confirm Booking"}
                            </button>
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