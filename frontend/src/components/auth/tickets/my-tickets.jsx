import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosInstance";

const MyTickets = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axiosInstance.get(`/api/tickets/booking/user/${user.id}`);
                setTickets(res.data);
            } catch (error) {
                console.error("Error fetching user tickets:", error);
            }
        };

        fetchTickets();
    }, [user]);

    const handleCancelTicket = async (ticketId) => {
        try {
            await axiosInstance.put(`/api/tickets/${ticketId}/cancel`);
            setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
            setMessage("Ticket canceled successfully!");
            setTimeout(() => {
                setMessage("");
            }, 2000);
        } catch (error) {
            console.error("Error canceling ticket:", error);
            setMessage("Failed to cancel the ticket. Please try again.");
        }
    };

    console.log(tickets);

    return (
        <div className="bookTicket section">
            <div className="bookTicketContainer container">
                <h2>Your Booked Tickets</h2>

                {message && (
                    <p className={`message ${message.includes("Failed") ? "error" : "success"}`}>
                        {message}
                    </p>
                )}

                {tickets.length > 0 ? (
                    <>
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="ticketDetails">
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
                                    {ticket.booking_status === "Canceled" ? (
                                        <button className="btn confirmBtn" disabled>
                                            Canceled
                                        </button>
                                    ) : (
                                        <button
                                            className="btn cancelBtn"
                                            onClick={() => handleCancelTicket(ticket.id)}
                                        >
                                            Cancel Ticket
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <p>No booked tickets found.</p>
                )}
            </div>
        </div>
    );
};

export default MyTickets;
