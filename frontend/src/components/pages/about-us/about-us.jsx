import React from 'react';
import { Link } from "react-router-dom";
import { Globe, Target, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="airline-about-wrapper section">
      <div className="container">
        <header className="about-hero">
          <div className="hero-content">
            <h1>QAirLine Story</h1>
            <p>Euphoria in Every Flight</p>
          </div>
        </header>

        <main className="about-main">
          <section className="about-section history-section">
            <div className="section-grid">
              <div className="section-icon-container">
                <Globe className="section-icon" />
              </div>
              <div className="section-content">
                <h2>Our History</h2>
                <p>
                  Founded in 2010, QAirline emerged from a vision to connect people across
                  continents. What began as a modest fleet with a handful of routes has transformed
                  into a dynamic international carrier, bridging cultures and creating opportunities.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section mission-section">
            <div className="section-grid">
              <div className="section-icon-container">
                <Target className="section-icon" />
              </div>
              <div className="section-content">
                <h2>Mission & Vision</h2>
                <p>
                  We are committed to delivering world-class travel experiences that go beyond transportation.
                  Our mission is to create seamless, innovative journeys that connect people, cultures, and
                  possibilities, while maintaining the highest standards of safety and customer satisfaction.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section commitment-section">
            <div className="section-grid">
              <div className="section-icon-container">
                <Award className="section-icon" />
              </div>
              <div className="section-content">
                <h2>Our Commitment</h2>
                <ul className="commitment-list">
                  <li>Ensure passenger safety as our highest priority</li>
                  <li>Minimize our environmental footprint</li>
                  <li>Provide personalized, memorable travel experiences</li>
                  <li>Continuously innovate and improve our services</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="about-cta">
            <div className="cta-content">
              <h2>Join Our Journey</h2>
              <p>Discover a new way of traveling. Experience the SkyConnect difference.</p>
              <button className="cta-button">
                <Link to="/ticket-list">
                  Book Your Flight
                </Link>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default About;