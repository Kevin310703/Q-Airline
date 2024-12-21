import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";

const AirplaneDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const airplaneId = location.pathname.split("/")[2];

    const [airplane, setAirplane] = useState(null);
    const [seats, setSeats] = useState([]);
    const [flights, setFlights] = useState([]);

    const [selectedSeat, setSelectedSeat] = useState(null);
    const [selectedFlights, setSelectedFlights] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch thông tin máy bay
                const airplaneRes = await axiosInstance.get(`/api/airplanes/${airplaneId}`);
                setAirplane(airplaneRes.data);

                // Fetch danh sách ghế
                const seatsRes = await axiosInstance.get(`/api/airplane-seats/${airplaneId}`);
                setSeats(seatsRes.data);

                // Fetch danh sách chuyến bay
                const flightsRes = await axiosInstance.get(`/api/airplane-flights/airplane/${airplaneId}`);
                setFlights(flightsRes.data);
            } catch (error) {
                console.error("Error fetching airplane details:", error);
            }
        };

        fetchData();
    }, [airplaneId]);

    const handleSelectFlight = (flight) => {
        setSelectedFlights((prev) => {
            if (prev[selectedSeat.seat_id]?.id === flight.id) {
                // Nếu chọn lại chuyến bay đã chọn trước đó, hủy chọn
                const updated = { ...prev };
                delete updated[selectedSeat.seat_id];
                return updated;
            }

            // Cập nhật chuyến bay được chọn cho ghế hiện tại
            return { ...prev, [selectedSeat.seat_id]: flight };
        });
    };

    const openModal = (seat) => {
        setSelectedSeat(seat);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSeat(null);
        setSelectedFlights((prev) => {
            const updated = { ...prev };
            delete updated[selectedSeat?.seat_id];
            return updated;
        });
    };

    const handleBookTicket = async () => {
        if (!selectedFlights || !selectedSeat) {
            alert("Please select a flight and a seat before booking.");
            return;
        }

        navigate(`/book-ticket`, {
            state: {
                airplane,
                selectedFlights: selectedFlights[selectedSeat.seat_id],
                selectedSeat,
            },
        });
    };

    if (!airplane) {
        return <p>Loading airplane details...</p>;
    }

    console.log(airplane);
    console.log(seats);
    console.log(flights);

    return (
        <div className="airplaneDetail section">
            <h2>Airplane Details</h2>

            <div className="airplaneDetailContainer container">
                <section className="basicInfo">
                    <h3>Basic Information</h3>
                    <div className="infoContainer">
                        <div className="avatarSection">
                            <img
                                src={airplane.avatar || "/default-avatar.png"}
                                alt="Airplane Avatar"
                                className="airplaneAvatar"
                            />
                        </div>

                        <div className="infoColumns">
                            <div className="infoColumn">
                                <ul>
                                    <li><strong>Model:</strong> {airplane.model}</li>
                                    <li><strong>Manufacturer:</strong> {airplane.manufacturer}</li>
                                    <li><strong>Year of Manufacture:</strong> {airplane.year_of_manufacture}</li>
                                    <li><strong>Registration Number:</strong> {airplane.registration_number}</li>
                                </ul>
                            </div>

                            <div className="infoColumn">
                                <ul>
                                    <li><strong>Fuel Capacity:</strong> {airplane.fuel_capacity} liters</li>
                                    <li><strong>Capacity:</strong> {airplane.capacity} seats</li>
                                    <li><strong>Last Inspection Date:</strong> {new Date(airplane.last_inspection_date).toLocaleDateString()}</li>
                                    <li>
                                        <strong>Status:</strong>
                                        <span className={`statusLabel ${airplane.status.toLowerCase()}`}>
                                            {airplane.status}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="seatsInfo">
                    <h3>Seats</h3>
                    <div className="seatsGrid">
                        {seats.map((seat) => (
                            <div
                                key={seat.seat_id}
                                className={`seat ${seat.seat_class.toLowerCase()} ${seat.is_occupied ? "occupied" : "available"
                                    }`}
                                title={`Seat ${seat.seat_number} (${seat.seat_class})`}
                                onClick={() => openModal(seat)}
                            >
                                {seat.seat_number}
                            </div>
                        ))}
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="customModal">
                            <div className="modalContent">
                                <button onClick={closeModal} className="closeButton">&times;</button>
                                <h3>Seat Details</h3>
                                <div
                                    className={`seatPreview ${selectedSeat.seat_class.toLowerCase()} ${selectedSeat.is_occupied ? "occupied" : "available"}`}
                                    title={`Seat ${selectedSeat.seat_number} (${selectedSeat.seat_class})`}
                                >
                                    {selectedSeat.seat_number}
                                </div>
                                <ul>
                                    <li><strong>Seat Number:</strong> {selectedSeat.seat_number}</li>
                                    <li><strong>Class:</strong> {selectedSeat.seat_class}</li>
                                    <li><strong>Status:</strong> {selectedSeat.is_occupied ? "Occupied" : "Available"}</li>
                                    <li><strong>Row Number:</strong> {selectedSeat.rows_number}</li>
                                    <li><strong>Price:</strong> ${selectedSeat.price}</li>
                                    <li><strong>Notes:</strong> {selectedSeat.notes || "N/A"}</li>
                                </ul>
                                {!selectedSeat.is_occupied && (
                                    <>
                                        <h3>Select a Flight</h3>
                                        <div className="flightsList">
                                            {flights.map((flight) => (
                                                <div
                                                    key={flight.id}
                                                    className={`flightOption ${selectedFlights[selectedSeat.seat_id]?.id === flight.id ? "selected" : ""
                                                        }`}
                                                    onClick={() => handleSelectFlight(flight)}
                                                >
                                                    <p><strong>{flight.departure_airport}</strong> → <strong>{flight.arrival_airport}</strong></p>
                                                    <p>{new Date(flight.departure_time).toLocaleString()} - {new Date(flight.arrival_time).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            className="bookButton"
                                            onClick={handleBookTicket}
                                            disabled={!selectedFlights}
                                        >
                                            Book ticket
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="modalOverlay" onClick={closeModal}></div>
                        </div>
                    )}
                </section>

                <section className="flightsInfo">
                    <h3>Flights</h3>
                    {flights.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Airplane</th>
                                    <th>Departure Airport</th>
                                    <th>Arrival Airport</th>
                                    <th>Departure Time</th>
                                    <th>Arrival Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map((flight, index) => (
                                    <tr key={flight.id || index}>
                                        <td>{flight.airplane_registration_number}</td>
                                        <td>{flight.departure_airport}</td>
                                        <td>{flight.arrival_airport}</td>
                                        <td>{new Date(flight.departure_time).toLocaleString()}</td>
                                        <td>{new Date(flight.arrival_time).toLocaleString()}</td>
                                        <td>
                                            <span className={`status ${flight.status.toLowerCase()}`}>
                                                {flight.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No flights available for this airplane.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AirplaneDetails;
