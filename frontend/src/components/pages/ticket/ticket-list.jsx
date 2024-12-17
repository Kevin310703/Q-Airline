import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";


import axiosInstance from "../../config/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import Modal from "../../modal/modal-info";

const TicketList = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await axiosInstance.get("/api/tickets"); // Replace with your ticket API endpoint
                const availableTickets = res.data.filter(
                    (ticket) => ticket.booking_status === 'N/A' || ticket.booking_status !== 'Confirmed'
                );
                setTickets(availableTickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };

        fetchTickets();
    }, []);

    const handleBooking = (ticketId) => {
        if (!user) {
            setShowModal(true);
        } else {
            navigate(`/book-ticket/${ticketId}`);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate("/signin");
    }

    console.log(tickets);

    return (
        <div className="ticketList section">
            <div className=" ticketListContainer container">
                <h2>Flight Tickets</h2>
                {tickets.length > 0 ? (
                    <div className="ticketsGrid">
                        {tickets.map((ticket, index) => (
                            <div key={ticket.id || index} className="ticketCard">
                                <div className="ticketHeader">
                                    <h4>{ticket.departure_city} → {ticket.arrival_city}</h4>
                                </div>
                                <div className="ticketDetails">
                                    <p><strong>Airplane:</strong> {ticket.airplane_model}</p>
                                    <p>
                                        <strong>Seat:</strong> {ticket.seat_number} 
                                        <span className={`seatClass ${ticket.seat_class.toLowerCase()}`}>
                                            ({ticket.seat_class})
                                        </span>
                                    </p>
                                    <p><strong>Price:</strong> ${ticket.price}</p>
                                    <p><strong>Departure:</strong> {new Date(ticket.departure_time).toLocaleString()}</p>
                                    <p><strong>Arrival:</strong> {new Date(ticket.arrival_time).toLocaleString()}</p>
                                </div>

                                <button className="btn"
                                    onClick={() => handleBooking(ticket.id)}>
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No tickets available. Please try again later.</p>
                )}
            </div>

            {showModal && (
                <Modal
                    message="Please log in to book a ticket."
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default TicketList;
