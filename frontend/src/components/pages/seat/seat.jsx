import React, { useState } from 'react';
import { Link } from "react-router-dom";

// Sample seat data
const seatData = [
    {
        class: 'Economy Class',
        price: '$100',
        location: 'Rows 20-35',
        image: '/seat/economy_class.png',
        features: ['Standard seat', 'Basic comfort', 'Standard amenities']
    },
    {
        class: 'Business Class',
        price: '$800',
        location: 'Rows 1-5',
        image: '/seat/bussiness_class.jpg',
        features: ['Wide seats', 'Fully flat beds', 'Gourmet dining']
    },
    {
        class: 'First Class',
        price: '$1,500',
        location: 'Exclusive front section',
        image: '/seat/first_class.jpg',
        features: ['Private suite', 'Personal butler', 'Luxury experience']
    }
];

const SeatClassCard = ({ seatClass, onClick }) => {
    return (
        <div className="seat-class-card" onClick={onClick}>
            <div className="seat-class-header">
                <h3>{seatClass.class}</h3>
            </div>
            <div className="seat-class-content">
                <div className="seat-details">
                    <ul>
                        <li>
                            <div className="seat-price">
                                <span className="label">Price </span>
                                <span className="value">{seatClass.price}</span>
                            </div>
                        </li>
                        <li>
                            <div className="seat-location">
                                <span className="label">Location: </span>
                                <span className="value">{seatClass.location}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="seat-image">
                    <img src={seatClass.image} alt={`${seatClass.class} seat`} />
                </div>
                <div className="seat-features">
                    <span className="label">Features</span>
                    <ul>
                        {seatClass.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const Seats = () => {
    const [selectedClass, setSelectedClass] = useState(null);

    return (
        <div className="seat section">
            <div className="seat-map-container container">
                <header className="seat-map-header">
                    <h1>Seats Information</h1>
                </header>
                <div className="seat-classes-grid">
                    {seatData.map((seatClass, index) => (
                        <SeatClassCard
                            key={index}
                            seatClass={seatClass}
                            onClick={() => setSelectedClass(seatClass)}
                        />
                    ))}
                </div>
                {selectedClass && (
                    <div className="selected-class-section">
                        <div className="selected-class-details">
                            <h2>Selected Seat Class: {selectedClass.class}</h2>
                            <p>You have selected {selectedClass.class} with a price of {selectedClass.price}</p>
                        </div>
                        <div className="book-now-section">
                            <Link to="/ticket-list" className="book-now-btn">
                                Book Now
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Seats;