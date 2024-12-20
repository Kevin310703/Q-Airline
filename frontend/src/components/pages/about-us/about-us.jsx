import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="about container section">
      <div className="sectionContainer header">
        <h1 className="title">About QAirline</h1>
        <p className="subtitle">
          A journey of innovation, connection, and excellence in the skies
        </p>
      </div>

      <div className="content-grid">
        {/* History Section */}
        <div className="card history-card">
          <div className="card-header">
            <span className="icon">✈️</span>
            <h2 className="card-title">Our History</h2>
          </div>
          <div className="card-content">
            <p>
              QAirline was founded in 1995 by a group of visionary entrepreneurs who saw the potential
              to revolutionize air travel in our region. What started as a small, regional carrier
              has grown into a national airline connecting millions of passengers each year.
            </p>
            <p>
              In our early years, we operated with just two small aircraft, serving local routes.
              By 2005, we had expanded to become a major domestic carrier, and in 2015, we launched
              our first international routes, marking a significant milestone in our journey.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="card mission-card">
          <div className="card-header">
            <span className="icon">🌐</span>
            <h2 className="card-title">Our Mission</h2>
          </div>
          <p className="mission-description">
            At QAirline, we are committed to connecting people, cultures, and opportunities.
            Our mission is to provide safe, reliable, and comfortable air travel that makes
            the world more accessible to everyone.
          </p>
          <ul className="mission-list">
            <li>
              <span className="check-icon">✓</span> Safety First
            </li>
            <li>
              <span className="check-icon">✓</span> Customer Satisfaction
            </li>
            <li>
              <span className="check-icon">✓</span> Sustainable Travel
            </li>
          </ul>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="achievements-section">
        <div className="achievements-grid">
          <div className="achievement-item">
            <span className="achievement-icon">🏆</span>
            <span className="achievement-number">25+</span>
            <span className="achievement-label">Years of Service</span>
          </div>
          <div className="achievement-item">
            <span className="achievement-icon">👥</span>
            <span className="achievement-number">5M+</span>
            <span className="achievement-label">Passengers Annually</span>
          </div>
          <div className="achievement-item">
            <span className="achievement-icon">✈️</span>
            <span className="achievement-number">50+</span>
            <span className="achievement-label">Destinations</span>
          </div>
        </div>
        <p className="achievements-description">
          Our commitment to excellence has been recognized through numerous industry awards
          and the trust of millions of passengers who choose QAirline for their travel needs.
        </p>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h3 className="cta-title">Join Us in the Skies</h3>
        <p className="cta-description">
          Whether you're traveling for business or leisure, QAirline is your trusted partner
          in making your journey memorable and comfortable.
        </p>
        <Link to="/ticket-list" className="cta-button">
          Book Your Flight
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;