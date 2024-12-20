import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {
    GoogleMap,
    LoadScript,
    Marker
} from '@react-google-maps/api';
import axiosInstance from "../../config/axiosInstance";

// Map container style
const mapContainerStyle = {
    width: '100%',
    height: '650px'
};

const Destinations = () => {
    const [destinationsData, setDestinationsData] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await axiosInstance.get("/api/destinations");
                setDestinationsData(response.data);

                if (response.data.length > 0) {
                    setSelectedDestination(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching destinations:", error);
            }
        };

        fetchDestinations();
    }, []);

    const handleDestinationSelect = (destination) => {
        setSelectedDestination(destination);
    };

    console.log(destinationsData);

    return (
        <div className="destination section">
            <div className="destinationContainer container">
                <h1 className="destinationTitle">Our Destinations</h1>

                <div className="destinationContent">
                    {/* Destinations List */}
                    <div className="destinationList">
                        {destinationsData.map((destination) => (
                            <div
                                key={destination.id}
                                className={`destinationCard ${selectedDestination.id === destination.id ? 'active' : ''}`}
                                onClick={() => handleDestinationSelect(destination)}
                            >
                                <img
                                    src={destination.image_url}
                                    alt={destination.name}
                                    className="destinationImage"
                                />
                                <div className="destinationInfo">
                                    <h3 className="destinationName">{destination.name}</h3>
                                    <p className="destinationDescription">{destination.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Destination Details */}
                    {selectedDestination ? (
                        <div className="mapContainer">
                            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_APIKEY}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={{
                                        lat: parseFloat(selectedDestination.latitude),
                                        lng: parseFloat(selectedDestination.longitude),
                                    }}
                                    zoom={11}
                                >
                                    <Marker
                                        position={{
                                            lat: parseFloat(selectedDestination.latitude),
                                            lng: parseFloat(selectedDestination.longitude),
                                        }}
                                        title={selectedDestination.name}
                                    />
                                </GoogleMap>
                            </LoadScript>
                        </div>
                    ) : (
                        <p className="noDestination">No destination selected.</p>
                    )}
                </div>

                {/* Call to Action */}
                <div className="destinationCta">
                    <h3>Ready to Explore?</h3>
                    <p>Book your next adventure with Q-Airline and discover these incredible destinations.</p>
                    <Link to="/ticket-list" className="btnBookFlight">
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Destinations;