import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";

const SearchResults = () => {
    const location = useLocation();
    const searchData = location.state || {}; // Lấy dữ liệu từ state được truyền từ `Search`
    const [results, setResults] = useState([]); // Lưu kết quả tìm kiếm
    const [loading, setLoading] = useState(true); // Trạng thái tải
    const [error, setError] = useState(null); // Lưu lỗi nếu có

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

    const mockResults = [
        {
            id: 1,
            from: "New York",
            to: "Tokyo",
            date: "2024-12-01",
            price: "$750",
            airline: "Japan Airlines"
        },
        {
            id: 2,
            from: "New York",
            to: "Tokyo",
            date: "2024-12-01",
            price: "$800",
            airline: "ANA"
        },
        {
            id: 3,
            from: "New York",
            to: "Tokyo",
            date: "2024-12-01",
            price: "$720",
            airline: "United Airlines"
        }
    ];

    const filteredResults = mockResults.filter(
        (result) =>
            (!searchData.location || result.to.toLowerCase().includes(searchData.location.toLowerCase())) &&
            (!searchData.date || result.date === searchData.date)
    );

    console.log(searchData);
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
                                    {result.departure_airport_name} → {result.arrival_airport_name}
                                </h3>
                                <p><strong>Airplane:</strong> {result.airplane_model}</p>
                                <p><strong>Departure:</strong> {result.departure_time}</p>
                                <p><strong>Arrival:</strong> {result.arrival_time}</p>
                                <p><strong>Price:</strong> ${result.seat_price}</p>
                                <button className="btn">Book Now</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    !loading && <p>No flights found. Try adjusting your search criteria.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
