import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosInstance";
import { PayPalButtons } from "@paypal/react-paypal-js";

const NewBookTicket = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPaypal, setShowPaypal] = useState(false);

    // Nhận dữ liệu truyền từ AirplaneDetails
    const { airplane, selectedFlights, selectedSeat } = location.state || {};

    if (!airplane || !selectedFlights || !selectedSeat) {
        return <p>No ticket information provided. Please select details again.</p>;
    }

    // Khi người dùng nhấn nút Confirm Booking, hiển thị nút PayPal
    const handleConfirmBooking = (e) => {
        e.preventDefault();
        setShowPaypal(true);
    };

    // Hàm gọi API backend để lưu thông tin đặt vé sau khi thanh toán thành công
    const handleBookingAfterPayment = async (paypalOrderId) => {
        setIsSubmitting(true);
        try {
            await axiosInstance.post("/api/tickets-booking", {
                user_id: user.id,
                flight_id: selectedFlights.id,
                seat_number: selectedSeat.seat_number,
                seat_class: selectedSeat.seat_class,
                price: selectedSeat.price,
                payment_method: "Paypal",
                paypal_order_id: paypalOrderId, // Truyền PayPal Order ID
            });
            setMessage("Booking ticket confirmed successfully!");
            window.setTimeout(() => {
                navigate("/my-ticket");
            }, 2000);
        } catch (error) {
            console.error("Error confirming ticket:", error);
            setMessage("Failed to confirm booking ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            <p>
                                {new Date(selectedFlights.departure_time).toLocaleString()} -{" "}
                                {new Date(selectedFlights.arrival_time).toLocaleString()}
                            </p>
                        </div>
                        <p className="flightDuration">
                            Duration:
                            {(() => {
                                const durationMs =
                                    new Date(selectedFlights.arrival_time) -
                                    new Date(selectedFlights.departure_time);
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
                            <p>
                                <strong>Departure airport:</strong> {selectedFlights.departure_airport},{" "}
                                {selectedFlights.departure_city}
                            </p>
                            <p>
                                <strong>Arrival airport:</strong> {selectedFlights.arrival_airport},{" "}
                                {selectedFlights.arrival_city}
                            </p>
                        </div>
                        <div className="ticketPrice">
                            <p>
                                <strong>Total price:</strong>{" "}
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(selectedSeat.price)}
                            </p>
                        </div>
                    </div>

                    <div className="ticketActions flex">
                        {!showPaypal && (
                            <>
                                <button
                                    className="btn confirmBtn"
                                    onClick={handleConfirmBooking}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                                </button>
                                <button className="btn cancelBtn" onClick={() => navigate(-1)}>
                                    Cancel
                                </button>
                            </>
                        )}

                        {showPaypal && (
                            <div className="paypalContainer">
                                <PayPalButtons
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: parseFloat(selectedSeat.price).toFixed(2), // Chuyển VND sang USD (tỷ giá giả định 1 USD = 23,000 VND)
                                                        currency_code: "USD",
                                                    },
                                                    description: `Flight from ${selectedFlights.departure_city} to ${selectedFlights.arrival_city}`,
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            const paypalOrderId = data.orderID;
                                            handleBookingAfterPayment(paypalOrderId); // Gọi hàm xác nhận booking sau khi thanh toán thành công
                                        });
                                    }}
                                    onError={(err) => {
                                        console.error("PayPal Checkout onError", err);
                                        setMessage("Payment failed. Please try again.");
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewBookTicket;