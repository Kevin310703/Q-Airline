import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from "react-router-dom";
import axiosInstance from '../../config/axiosInstance';

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axiosInstance.get('/api/promotions');
                setOffers(response.data);
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };

        fetchOffers();
    }, []);

    const nextOffer = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === offers.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevOffer = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? offers.length - 1 : prevIndex - 1
        );
    };

    const getCardClassName = (index) => {
        const totalOffers = offers.length;
        const middleIndex = currentIndex;
        const leftIndex = (middleIndex - 1 + totalOffers) % totalOffers;
        const rightIndex = (middleIndex + 1) % totalOffers;

        if (index === middleIndex) return 'offer-card active-center';
        if (index === leftIndex) return 'offer-card active-left';
        if (index === rightIndex) return 'offer-card active-right';
        return 'offer-card hidden';
    };

    return (
        <div className="offer section">
            <div className="airline-offers-container container">
                <div className="offers-header">
                    <h1>Incredible Flight Offers</h1>
                    <p>Discover exclusive promotions tailored just for you</p>
                </div>

                <div className="offers-carousel">
                    <button
                        className="carousel-control prev"
                        onClick={prevOffer}
                    >
                        <ChevronLeft />
                    </button>

                    <div className="offers-wrapper">
                        {offers.map((offer, index) => (
                            <div
                                key={offer.id}
                                className={getCardClassName(index)}
                            >
                                <div className="offer-card-header">
                                    <h2>{offer.title}</h2>
                                </div>

                                <img
                                    src={offer.image_url}
                                    alt={offer.title}
                                    className="offer-image"
                                />

                                <div className="offer-card-body">
                                    <div className="offer-destination">{offer.destination}</div>
                                    <div className="offer-price-section">
                                        <span className="offer-price">${offer.price}</span>
                                        <span className="offer-discount">{offer.discount_percentage}% OFF</span>
                                    </div>
                                    <p className="offer-description">{offer.description}</p>
                                    <div className="offer-validity">
                                        <span>Valid: {offer.valid_period}</span>
                                    </div>
                                </div>
                                <button className="offer-button">
                                    <Link to="/ticket-list">
                                        Book Now
                                    </Link>
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        className="carousel-control next"
                        onClick={nextOffer}
                    >
                        <ChevronRight />
                    </button>

                    <div className="offer-indicators">
                        {offers.map((_, index) => (
                            <span
                                key={index}
                                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offers;