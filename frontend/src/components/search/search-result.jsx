import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";

const SearchResults = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchData = location.state || {}; // Lấy dữ liệu từ state được truyền từ `Search`
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await axiosInstance.get("/api/search-flights", {
                    params: {
                        departureLocation: searchData.departureLocation,
                        destinationLocation: searchData.destinationLocation,
                        checkIn: searchData.checkIn,
                        checkOut: searchData.checkOut,
                        seatClass: searchData.seatClass,
                    },
                });
                setResults(res.data); // Lưu kết quả
            } catch (err) {
                console.error("Error fetching flights:", err);
                setError("Failed to fetch flights. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (searchData.departureLocation && searchData.destinationLocation) {
            fetchFlights(); // Gọi API nếu có đủ dữ liệu
        } else {
            setLoading(false); // Nếu thiếu dữ liệu, dừng tải
        }
    }, [searchData]);

    const handleBookNow = (flight, seat) => {
        navigate("/book-ticket", {
            state: {
                airplane: {
                    model: flight.airplane_model,
                    registration_number: flight.airplane_registration_number,
                },
                selectedFlights: flight,
                selectedSeat: seat,
            },
        });
    };

    console.log(searchData);
    console.log(results);
    return (
        <div className="searchResults section">
            <div className="searchResultContainer container">
                <h2>Search Results</h2>
                {loading && <p>Loading flights...</p>}
                {error && <p className="error">{error}</p>}

                {!loading && !error && results.length > 0 ? (
                    <div className="resultsGrid">
                        {results.map((result, index) => (
                            <div key={index} className="resultCard">
                                <h3>
                                    {result.departure_city} → {result.arrival_city}
                                </h3>
                                <p><strong>Airplane:</strong> {result.airplane_model}</p>
                                <p>
                                    <strong>Seat:</strong> {result.seat_number}
                                    <span className={`seatClass ${result.seat_class.toLowerCase()}`}>
                                        ({result.seat_class})
                                    </span>
                                </p>
                                <p><strong>Departure airport:</strong> {result.departure_airport}.</p>
                                <p><strong>Departure time:</strong> {new Date(result.departure_time).toLocaleString()}</p>
                                <p><strong>Arrival airport:</strong> {result.arrival_airport}.</p>
                                <p><strong>Arrival time:</strong> {new Date(result.arrival_time).toLocaleString()}</p>
                                <p><strong>Price:</strong> ${result.seat_price}</p>
                                <button
                                    className="btn"
                                    onClick={() => handleBookNow(result, {
                                        seat_number: result.seat_number,
                                        seat_class: result.seat_class,
                                        price: result.seat_price,
                                    })}
                                >
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && <p>No flights found. Try adjusting your search criteria.</p>
                )}
            </div>
        </div >
    );
};

export default SearchResults;
