import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import { TiSocialFacebook, } from "react-icons/ti"
import { AiOutlineTwitter, AiFillYoutube, AiFillGoogleCircle } from "react-icons/ai"

import Aos from "aos"
import "aos/dist/aos.css"

const Footer = () => {
    useEffect(() => {
        Aos.init({ duration: 2000 })
    }, []);

    return (
        <div className="footer">
            <div className="sectionContainer container grid">
                <div data-aos='fade-up' data-aos-duration='2500' className="gridOne">
                    <div className="logoDiv">
                        <Link to="/" className="logoLink">
                            <img src="/logo.png" alt="" className="Logo" />
                            <div class="logoName">Q-AirLine</div>
                        </Link>
                    </div>
                    <p>Your mind should be stronger than your feelings, fly!</p>
                    <div className="socialIcon flex">
                        <TiSocialFacebook className="icon" />
                        <AiOutlineTwitter className="icon" />
                        <AiFillYoutube className="icon" />
                        <AiFillGoogleCircle className="icon" />
                    </div>
                </div>

                <div data-aos='fade-up' data-aos-duration='2500' className="footerLinks">
                    <span className="linkTitle">Information</span>
                    <li>
                        <a href="">Home</a>
                    </li>

                    <li>
                        <a href="">Explore</a>
                    </li>

                    <li>
                        <a href="/flight-list">Flight status</a>
                    </li>

                    <li>
                        <a href="">Travel</a>
                    </li>

                    <li>
                        <a href="">Check-In</a>
                    </li>

                    <li>
                        <a href="/my-ticket">Manage your booking</a>
                    </li>
                </div>

                <div data-aos='fade-up' data-aos-duration='2500' className="footerLinks">
                    <span className="linkTitle">Services</span>
                    <li>
                        <a href="">FAQ</a>
                    </li>

                    <li>
                        <a href="">How to</a>
                    </li>

                    <li>
                        <a href="">Features</a>
                    </li>

                    <li>
                        <a href="">Baggage</a>
                    </li>

                    <li>
                        <a href="">Route Map</a>
                    </li>

                    <li>
                        <a href="">Our communities</a>
                    </li>
                </div>

                <div data-aos='fade-up' data-aos-duration='2500' className="footerLinks">
                    <span className="linkTitle">Qick Guide</span>
                    <li>
                        <a href="/airplane-list">Airplane</a>
                    </li>

                    <li>
                        <a href="/ticket-list">Ticket</a>
                    </li>

                    <li>
                    <a href="/flight-list">Flight</a>
                    </li>
                </div>
            </div>

            <div className="copyRightDiv flex">
                <p>INT3306_7 | Developed by <a href="">Team 11</a></p>
            </div>
        </div>
    )
}

export default Footer