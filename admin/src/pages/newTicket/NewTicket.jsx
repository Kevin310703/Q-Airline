import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import "./newTicket.scss";
import dayjs from "dayjs";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const NewTicket = ({ inputs, title }) => {
    const navigate = useNavigate();

    const [info, setInfo] = useState({});
    const [errors, setErrors] = useState({});
    const [preBooking, setPreBooking] = useState(null); // Lưu trữ thông tin booking tạm thời
    const [flights, setFlights] = useState([]);
    const [seats, setSeats] = useState([]);
    const [allSeats, setAllSeats] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);

    // Lấy danh sách chuyến bay khi component mount
    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const res = await axiosInstance.get("/api/airplane-flights");
                console.log(res.data);
                setFlights(
                    res.data.map((flight) => ({
                        value: flight.id,
                        airplane_id: flight.airplane_id,
                        airplane_model: flight.airplane_model,
                        airplane_registration: flight.airplane_registration,
                        arrival_airport: flight.arrival_airport,
                        arrival_time: flight.arrival_time,
                        departure_airport: flight.departure_airport,
                        departure_time: flight.departure_time,
                        label: `${flight.airplane_model}: ${flight.departure_airport} to ${flight.arrival_airport}`,
                    }))
                );
            } catch (error) {
                console.error("Failed to fetch flights:", error);
                toast.error("Failed to fetch flights. Please try again.");
            }
        };
        fetchFlights();
    }, []);

    // Lấy danh sách ghế của chuyến bay được chọn
    useEffect(() => {
        const fetchSeats = async () => {
            console.log(selectedFlight);
            if (!selectedFlight) return;

            try {
                const res = await axiosInstance.get(`/api/airplane-seats/${selectedFlight}`);
                console.log(res.data);
                const allFetchedSeats = res.data.map((seat) => ({
                    value: seat.seat_number,
                    label: `${seat.seat_number} - ${seat.seat_class}`,
                    price: seat.price,
                    seat_class: seat.seat_class,
                    is_occupied: seat.is_occupied,
                }));
                setAllSeats(allFetchedSeats);
                setSeats(allFetchedSeats.filter((seat) => !seat.is_occupied));
            } catch (error) {
                console.error("Failed to fetch seats:", error);
                toast.error("Failed to fetch seats. Please try again.");
            }
        };
        fetchSeats();
    }, [selectedFlight]);

    // Lấy danh sách người dùng
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get("/api/users");
                console.log(res.data);
                setUsers(
                    res.data.map((user) => ({
                        value: user.id,
                        label: `${user.username} (${user.email})`,
                        username: user.username,
                        phone_number: user.phone,
                        birthday: user.birth_date,
                        address: user.address,
                        country: user.country,
                    }))
                );
            } catch (error) {
                console.error("Failed to fetch users:", error);
                toast.error("Failed to fetch users. Please try again.");
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setInfo((prev) => ({ ...prev, [id]: value }));

        if (id === "user_id") {
            const selectedUser = users.find((user) => user.value === Number(value));
            if (selectedUser) {
                setInfo((prev) => ({
                    ...prev,
                    username: selectedUser.username,
                    email: selectedUser.email,
                    phone_number: selectedUser.phone_number,
                    birthday: selectedUser.birthday,
                    address: selectedUser.address,
                    country: selectedUser.country,
                }));
            }
        }

        if (id === "flight_id") {
            const selected = flights.find((flight) => flight.value === Number(value));
            if (selected) {
                setSelectedFlight(selected.airplane_id); // Lưu airplane_id
                setInfo((prev) => ({
                    ...prev,
                    airplane_model: selected.airplane_model,
                    airplane_registration: selected.airplane_registration,
                    arrival_airport: selected.arrival_airport,
                    arrival_time: selected.arrival_time,
                    departure_airport: selected.departure_airport,
                    departure_time: selected.departure_time
                }));
            }
        }

        if (id === "seat_class") {
            const filteredSeats = allSeats.filter((seat) => seat.seat_class === value);
            console.log(filteredSeats);
            setSeats(
                filteredSeats.map((seat) => ({
                    value: seat.value,
                    label: `${seat.value} - ${seat.seat_class}`,
                    price: seat.price,
                    seat_class: seat.seat_class,
                }))
            );
        }

        if (id === "seat_number") {
            const selectedSeat = seats.find((seat) => seat.value === value);
            if (selectedSeat) {
                setInfo((prev) => ({
                    ...prev,
                    price: selectedSeat.price,
                    seat_class: selectedSeat.seat_class
                })); // Gán giá tiền
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Tạo pre-booking tạm thời
            setPreBooking(info);
            console.log("info", info);
            toast.success("Pre-booking created successfully. Please confirm to finalize.");
        } catch (error) {
            console.error("Error creating pre-booking:", error);
            toast.error("Failed to create pre-booking. Please try again.");
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.post("/api/tickets", {
                flight_id: info.flight_id,
                seat_number: info.seat_number,
                seat_class: info.seat_class,
                price: info.price
            });
            toast.success("Ticket created successfully!");
            setInfo({});
            navigate("/tickets");
        } catch (error) {
            console.error("Error creating ticket:", error);
            toast.error("Failed to create new ticket. Please try again.");
        }
    };

    const confirmBooking = async () => {
        console.log(preBooking);
        try {
            await axiosInstance.post("/api/tickets-booking", {
                user_id: preBooking.user_id,
                flight_id: preBooking.flight_id,
                seat_number: preBooking.seat_number,
                seat_class: preBooking.seat_class,
                price: preBooking.price
            }); // Gửi pre-booking chính thức
            toast.success("Ticket created successfully!");
            setInfo({});
            setPreBooking(null);
            navigate("/tickets");
        } catch (error) {
            console.error("Error confirming ticket:", error);
            toast.error("Failed to confirm ticket. Please try again.");
        }
    };

    const cancelPreBooking = () => {
        setPreBooking(null); // Xóa pre-booking
        toast.info("Pre-booking canceled.");
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                    <button onClick={() => navigate(-1)} className="backButton">
                        Back Page
                    </button>
                </div>
                <div className="bottom">
                    <div className="right">
                        {!preBooking ? (
                            <form onSubmit={handleSubmit}>
                                {/* Select User */}
                                <div className="formInput">
                                    <label>User</label>
                                    <select
                                        id="user_id"
                                        value={info.user_id || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a user</option>
                                        {users.map((user, index) => (
                                            <option key={user.value || index} value={user.value}>
                                                {user.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {inputs.map((input) => (
                                    <div className="formInput" key={input.id}>
                                        <label>{input.label}</label>
                                        {input.type === "select" ? (
                                            <select
                                                id={input.id}
                                                value={info[input.id] || ""}
                                                onChange={handleChange}
                                            >
                                                <option value="">{input.placeholder}</option>
                                                {(input.id === "flight_id"
                                                    ? flights
                                                    : (input.id === "seat_number"
                                                        ? seats
                                                        : input.options)).map((option, index) => (
                                                            <option key={option.value || index} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                            </select>
                                        ) : (
                                            <input
                                                onChange={handleChange}
                                                type={input.type}
                                                placeholder={input.placeholder}
                                                id={input.id}
                                                value={info[input.id] || ""}
                                            />
                                        )}

                                        {/* Hiển thị lỗi */}
                                        {errors[input.id] && (
                                            <span className="error-message">{errors[input.id]}</span>
                                        )}
                                    </div>
                                ))}

                                <div className="doubleButton">
                                    <button type="submit">Create Pre-Booking</button>

                                    <button
                                        type="button"
                                        onClick={handleCreateTicket}
                                        className="createTicketButton"
                                    >
                                        Create Ticket
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="preBooking">
                                <h2>Pre-Booking Details</h2>
                                <div className="detailsGrid">
                                    <div className="detailRow">
                                        <span>Fullname:</span>
                                        <span>{preBooking.username}</span>
                                    </div>
                                    <div className="detailRow">
                                        <span>Phone number:</span>
                                        <span>{preBooking.phone_number}</span>
                                    </div>
                                    <div className="detailRow">
                                        <span>Date of Birth:</span>
                                        <span>{dayjs(preBooking.birthday).format("DD-MM-YYYY")}</span>
                                    </div>
                                    <div className="detailRow">
                                        <span>Address:</span>
                                        <span>{preBooking.address}</span>
                                    </div>
                                    <div className="detailRow">
                                        <span>Country:</span>
                                        <span>{preBooking.country}</span>
                                    </div>
                                </div>

                                <table className="preBookingTable">
                                    <thead>
                                        <tr>
                                            <th>Field</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Airplane</td>
                                            <td>{preBooking.airplane_model} ({preBooking.airplane_registration})</td>
                                        </tr>
                                        <tr>
                                            <td>Seat Number</td>
                                            <td>{preBooking.seat_number} - {preBooking.seat_class}</td>
                                        </tr>
                                        <tr>
                                            <td>Departure Airport</td>
                                            <td>{preBooking.departure_airport}</td>
                                        </tr>
                                        <tr>
                                            <td>Departure Time</td>
                                            <td>{dayjs(preBooking.departure_time).format("YYYY-MM-DD HH:mm")}</td>
                                        </tr>
                                        <tr>
                                            <td>Arrival Airport</td>
                                            <td>{preBooking.arrival_airport}</td>
                                        </tr>
                                        <tr>
                                            <td>Arrival Time</td>
                                            <td>{dayjs(preBooking.arrival_time).format("YYYY-MM-DD HH:mm")}</td>
                                        </tr>
                                        <tr>
                                            <td>Price</td>
                                            <td>${preBooking.price}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="preBookingButtons">
                                    <button onClick={confirmBooking}>Confirm Booking</button>
                                    <button onClick={cancelPreBooking} className="cancelButton">
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewTicket;
