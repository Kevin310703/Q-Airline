import React, { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";

import { HiOutlineLocationMarker } from "react-icons/hi"
import { RiAccountPinCircleLine } from "react-icons/ri"
import { RxCalendar } from "react-icons/rx"

import Aos from "aos";
import "aos/dist/aos.css"
import axiosInstance from "../config/axiosInstance";

interface Airport {
    id: number;
    name: string;
    city: string;
    country: string;
    iata_code: string;
    created_at: string;
    updated_at: string;
}

const Search = () => {
    const [searchData, setSearchData] = React.useState({
        departureLocation: "",
        destinationLocation: "",
        travelers: "",
        checkIn: "",
        checkOut: "",
        seatClass: "",
    });

    const navigate = useNavigate();

    const [cities, setCities] = useState<string[]>([]);
    const [showLocations, setShowLocations] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === "departureLocation" && value === searchData.destinationLocation) {
            setSearchData({ ...searchData, departureLocation: value, destinationLocation: "" });
        } else if (name === "destinationLocation" && value === searchData.departureLocation) {
            setSearchData({ ...searchData, destinationLocation: value, departureLocation: "" });
        } else {
            setSearchData({ ...searchData, [name]: value });
        }
    };

    const handleSearch = () => {
        navigate("/search-results", { state: searchData });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowLocations(false); // Đóng dropdown
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await axiosInstance("/api/airports");
                const airports: Airport[] = res.data;
                const cityList = airports.map((airport: { city: string }) => airport.city);
                const uniqueCities = [...new Set(cityList)];
                setCities(uniqueCities);
            } catch (err) {
                console.error("Error fetching cities:", err);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        Aos.init({ duration: 2000 })
    }, []);

    console.log(cities);

    return (
        <div className="search container section">
            <div data-aos='fade-up' data-aos-duration='2500' className="sectionContainer grid">
                <div className="btns flex">
                    <div
                        className={`singleBtn ${searchData.seatClass === "Economy" ? "active" : ""}`}
                        onClick={() =>
                            setSearchData({
                                ...searchData,
                                seatClass: searchData.seatClass === "Economy" ? "" : "Economy",
                            })
                        }
                    >
                        <span>Economy</span>
                    </div>

                    <div
                        className={`singleBtn ${searchData.seatClass === "Business" ? "active" : ""}`}
                        onClick={() =>
                            setSearchData({
                                ...searchData,
                                seatClass: searchData.seatClass === "Business" ? "" : "Business",
                            })
                        }
                    >
                        <span>Business</span>
                    </div>

                    <div
                        className={`singleBtn ${searchData.seatClass === "First" ? "active" : ""}`}
                        onClick={() =>
                            setSearchData({
                                ...searchData,
                                seatClass: searchData.seatClass === "First" ? "" : "First",
                            })
                        }
                    >
                        <span>First</span>
                    </div>
                </div>

                <div data-aos='fade-up' data-aos-duration='2000' className="searchInputs flex">
                    {/* Single Input */}
                    <div className="singleInput flex">
                        <div className="iconDiv">
                            <HiOutlineLocationMarker className="icon" />
                        </div>
                        <div className="texts locationPopup" ref={dropdownRef}>
                            <div
                                onClick={() => setShowLocations(!showLocations)}
                                style={{ cursor: "pointer" }}
                            >
                                <h4>Location</h4>
                                <p>
                                    {searchData.departureLocation && searchData.destinationLocation
                                        ? `${searchData.departureLocation} → ${searchData.destinationLocation}`
                                        : "Where do you want to go?"}
                                </p>
                            </div>

                            {showLocations && (
                                <div className="locationDropdown">
                                    {/* Dropdown Đi */}
                                    <div className="singleDropdown">
                                        <h4>From</h4>
                                        <select
                                            name="departureLocation"
                                            value={searchData.departureLocation}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select location from</option>
                                            {cities.map((city, index) => (
                                                <option key={index} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Dropdown Đến */}
                                    <div className="singleDropdown">
                                        <h4>To</h4>
                                        <select
                                            name="destinationLocation"
                                            value={searchData.destinationLocation}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select location to</option>
                                            {cities
                                                .filter((city) => city !== searchData.departureLocation) // Loại bỏ địa điểm trùng
                                                .map((city, index) => (
                                                    <option key={index} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Single Input */}
                    <div className="singleInput flex">
                        <div className="iconDiv">
                            <RiAccountPinCircleLine className="icon" />
                        </div>

                        <div className="texts">
                            <h4>Travelers</h4>
                            <input
                                type="text"
                                name="travelers"
                                placeholder="Add guests"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Single Input */}
                    <div className="singleInput flex">
                        <div className="iconDiv">
                            <RxCalendar className="icon" />
                        </div>

                        <div className="texts">
                            <h4>Check In</h4>
                            <input
                                type="date"
                                placeholder="Add date"
                                name="checkIn"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Single Input */}
                    <div className="singleInput flex">
                        <div className="iconDiv">
                            <RxCalendar className="icon" />
                        </div>

                        <div className="texts">
                            <h4>Check Out</h4>
                            <input
                                type="date"
                                placeholder="Add date"
                                name="checkOut"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <button className="btn btnBlock flex" onClick={handleSearch}>Search Flight</button>
                </div>
            </div>
        </div>
    )
}

export default Search