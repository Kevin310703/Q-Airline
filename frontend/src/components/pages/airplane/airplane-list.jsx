import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { Link } from "react-router-dom";

const AirplanesList = () => {
    const [airplanes, setAirplanes] = useState([]);

    useEffect(() => {
        const fetchAirplanes = async () => {
            try {
                const response = await axiosInstance.get("/api/airplanes");
                setAirplanes(response.data);
            } catch (error) {
                console.error("Error fetching airplanes:", error);
            }
        };

        fetchAirplanes();
    }, []);

    console.log(airplanes);

    return (
        <div className="flightList section">
            <div className="flightContainer container">
                <h2>Airplane List</h2>
                <div className="table-wrapper">
                    <table className="flights-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Registration Number</th>
                                <th>Model</th>
                                <th>Capacity</th>
                                <th>Fuel Capacity</th>
                                <th>Year of Manufacture</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {airplanes.map((airplane) => (
                                <tr key={airplane.id}>
                                    <td>
                                        <img
                                            src={airplane.avatar || "https://via.placeholder.com/100"} // Avatar mặc định
                                            alt="Airplane Avatar"
                                            className="airplane-avatar"
                                        />
                                    </td>
                                    <td>
                                        <Link to={`/airplane-information/${airplane.id}`} className="link">
                                            {airplane.registration_number}
                                        </Link>
                                    </td>
                                    <td>{airplane.model}</td>
                                    <td>{airplane.capacity}</td>
                                    <td>{airplane.fuel_capacity}</td>
                                    <td>{airplane.year_of_manufacture}</td>
                                    <td>{airplane.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AirplanesList;
