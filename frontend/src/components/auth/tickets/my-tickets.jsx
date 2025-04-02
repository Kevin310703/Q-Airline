import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosInstance";
import dayjs from "dayjs";

const MyTickets = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            setTimeout(() => setMessage(""), 2000);
        } catch (error) {
            console.error("Error canceling ticket:", error);
            setMessage("Failed to cancel the ticket. Please try again.");
        }
    };

    const handleViewBill = async (ticket) => {
        try {
            const res = await axiosInstance.get(`/api/payments/booking/${ticket.booking_id}`);
            setPaymentInfo(res.data);
            setSelectedTicket(ticket);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching payment info:", error);
            setMessage("Failed to load bill. Please try again.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
        setPaymentInfo(null);
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
                                        <p>
                                            {new Date(ticket.departure_time).toLocaleString()} -{" "}
                                            {new Date(ticket.arrival_time).toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="flightDuration">
                                        Duration:
                                        {(() => {
                                            const durationMs =
                                                new Date(ticket.arrival_time) - new Date(ticket.departure_time);
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
                                        <p>
                                            <strong>Total price:</strong>{" "}
                                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(ticket.price)}
                                        </p>
                                    </div>
                                </div>
                                <div className="ticketActions flex">
                                    {ticket.booking_status === "Canceled" ? (
                                        <button className="btn confirmBtn" disabled>
                                            Canceled
                                        </button>
                                    ) : (
                                        <button className="btn cancelBtn" onClick={() => handleCancelTicket(ticket.id)}>
                                            Cancel Ticket
                                        </button>
                                    )}
                                    <button className="btn viewBillBtn" onClick={() => handleViewBill(ticket)}>
                                        View Bill
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <p>No booked tickets found.</p>
                )}

                {/* Modal hiển thị bill */}
                {isModalOpen && selectedTicket && (
                    <div className="modalOverlayBill">
                        <div className="modalContentBill">
                            <div className="modalHeaderBill">
                                <h3>Flight Invoice</h3>
                                <button className="modalCloseBtn" onClick={closeModal}>
                                    &times;
                                </button>
                            </div>
                            <div className="modalBodyBill">
                                <div className="section userInfoSection">
                                    <h4>User Information</h4>
                                    <div className="userInfoColumns">
                                        <div className="column">
                                            <p><strong>Name:</strong> {user.username}</p>
                                            <p><strong>DoB:</strong> {dayjs(user.dob).format("YYYY-MM-DD")}</p>
                                            <p><strong>Address:</strong> {user.address}</p>
                                            <p><strong>Gender:</strong> {user.gender}</p>
                                        </div>
                                        <div className="column">
                                            <p><strong>Country:</strong> {user.country}</p>
                                            <p><strong>Email:</strong> {user.email}</p>
                                            <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="section">
                                    <h4>Flight Ticket Details</h4>
                                    <p><strong>Flight:</strong> {selectedTicket.departure_city} → {selectedTicket.arrival_city}</p>
                                    <p><strong>Departure:</strong> {new Date(selectedTicket.departure_time).toLocaleString()}</p>
                                    <p><strong>Arrival:</strong> {new Date(selectedTicket.arrival_time).toLocaleString()}</p>
                                    <p><strong>Airplane:</strong> {selectedTicket.airplane_model} ({selectedTicket.airplane_registration})</p>
                                    <p><strong>Seat:</strong> {selectedTicket.seat_number} ({selectedTicket.seat_class})</p>
                                    <p><strong>Total Price:</strong> {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(selectedTicket.price)}</p>
                                </div>

                                {paymentInfo && (
                                    <div className="section">
                                        <h4>Payment Information</h4>
                                        {paymentInfo.paypal_order_id && (
                                            <p><strong>PayPal Order ID:</strong> {paymentInfo.paypal_order_id}</p>
                                        )}
                                        <p><strong>Amount:</strong> {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(paymentInfo.amount)}</p>
                                        <p><strong>Method:</strong> {paymentInfo.payment_method}</p>
                                        <p><strong>Date:</strong> {new Date(paymentInfo.payment_date).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                            <div className="modalFooterBill">
                                <button className="btn closeBtn" onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTickets;
