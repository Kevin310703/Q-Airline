import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Offers = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const offers = [
        {
            id: 1,
            title: "Asia Flight Mega Deal",
            destination: "Japan Expedition",
            price: "$290",
            discount: "30% OFF",
            validPeriod: "Jan 15-30, 2025",
            description: "Explore the Land of the Rising Sun with an incredible travel opportunity!",
            image: "/offer/japan_expedition.jpg"
        },
        {
            id: 2,
            title: "Weekend Flash Sale",
            destination: "Coastal Getaway",
            price: "$129",
            discount: "40% OFF",
            validPeriod: "Fri-Sun Weekly",
            description: "Grab our special short-haul weekend flight promotions now!",
            image: "/offer/coatstal_gateway.jpg"
        },
        {
            id: 3,
            title: "Midnight Flight Special",
            destination: "City Night Routes",
            price: "$89",
            discount: "25% OFF",
            validPeriod: "22:00 - 04:00 Daily",
            description: "Exclusive late-night flight deals with unbeatable prices!",
            image: "/offer/city_night_routes.jpg"
        },
        {
            id: 4,
            title: "Business Class Upgrade",
            destination: "International Routes",
            price: "$499",
            discount: "50% OFF",
            validPeriod: "Feb 1-28, 2025",
            description: "Luxury travel experience at an unbelievable price point!",
            image: "/offer/international_routes.jpg"
        },
        {
            id: 5,
            title: "Family Vacation Package",
            destination: "Multi-Destination Tour",
            price: "$799",
            discount: "45% OFF",
            validPeriod: "Mar 10-25, 2025",
            description: "Complete family vacation package with multiple stops!",
            image: "/offer/multi-destination_tour.jpg"
        },
        {
            id: 6,
            title: "Student Travel Pass",
            destination: "Global Campus Tour",
            price: "$199",
            discount: "35% OFF",
            validPeriod: "Summer Semester",
            description: "Special discounts for students exploring the world!",
            image: "/offer/global_campus_tour.jpg"
        },
        {
            id: 7,
            title: "Luxury Honeymoon Escape",
            destination: "Tropical Paradise",
            price: "$1,299",
            discount: "40% OFF",
            validPeriod: "Year-Round Special",
            description: "Romantic getaway packages for newlyweds and couples!",
            image: "/offer/tropical_paradise.png"
        }
    ];

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
                                    src={offer.image}
                                    alt={offer.title}
                                    className="offer-image"
                                />

                                <div className="offer-card-body">
                                    <div className="offer-destination">{offer.destination}</div>
                                    <div className="offer-price-section">
                                        <span className="offer-price">{offer.price}</span>
                                        <span className="offer-discount">{offer.discount}</span>
                                    </div>
                                    <p className="offer-description">{offer.description}</p>
                                    <div className="offer-validity">
                                        <span>Valid: {offer.validPeriod}</span>
                                    </div>
                                </div>
                                <button className="offer-button">Book Now</button>
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