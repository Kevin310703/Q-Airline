import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { SiConsul } from 'react-icons/si';
import { BsPhoneVibrate } from 'react-icons/bs';
import { AiOutlineGlobal } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { FaRegBell } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";

import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../config/axiosInstance";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { user, dispatch } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [bookingCount, setBookingCount] = useState(0);

    useEffect(() => {
        const fetchBookingCount = async () => {
            if (user) {
                try {
                    const res = await axiosInstance.get(`/api/tickets/booking/count/${user.id}`);
                    setBookingCount(res.data.bookingCount);
                } catch (error) {
                    console.error("Error fetching booking count:", error);
                }
            }
        };

        fetchBookingCount();
    }, [user]); // Chạy khi user thay đổi

    // Remove the navbar in the small width screens
    const [active, setActive] = useState('navBarMenu');
    const showNavBar = () => {
        setActive('navBarMenu showNavBar');
    };

    const removeNavBar = () => {
        setActive('navBarMenu');
    };

    // Add a background color to the second NavBar
    const [noBg, addBg] = useState('navBarTwo');
    const addBgColor = () => {
        if (window.scrollY >= 10) {
            addBg('navBarTwo navbar_With_Bg');
        } else {
            addBg('navBarTwo');
        }
    }
    window.addEventListener('scroll', addBgColor);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="navBar flex">
            <div className="navBarOne flex">
                <div>
                    <SiConsul className="icon" />
                </div>

                <div className="none flex">
                    <li className="flex"><BsPhoneVibrate className="icon" />Support</li>
                    <li className="flex"><AiOutlineGlobal className="icon" />Languages</li>
                </div>

                <div className="atb flex">
                    {user ? (
                        // Nếu người dùng đã đăng nhập
                        <div className="userMenu flex">
                            <div className="item" onClick={() => navigate("/my-ticket")}>
                                <LuShoppingCart className="icon" />
                                <div className="counter">{bookingCount}</div>
                            </div>

                            <div className="item">
                                <FaRegBell className="icon" />
                                <div className="counter">1</div>
                            </div>

                            <div className="avatarWrapper" onClick={toggleDropdown}>
                                <img
                                    src={user.avatar || "/default-avatar.png"}
                                    alt="avatar"
                                    className="avatar"
                                />
                                {showDropdown && (
                                    <div className="dropdownMenu">
                                        <span>{user.username}</span>
                                        <hr className="dropdownDivider" />
                                        <Link to="/profile" className="dropdownItem">
                                            Profile
                                        </Link>
                                        <Link to="/settings" className="dropdownItem">
                                            Settings
                                        </Link>
                                        <button onClick={handleLogout} className="dropdownItem logoutButton">
                                            Logout
                                        </button>

                                        {user.role === "Admin" && (
                                            <>
                                                <hr className="dropdownDivider" />
                                                <a
                                                    href="http://localhost:3000"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="dropdownItem"
                                                >
                                                    Admin Dashboard
                                                </a>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Nếu chưa đăng nhập
                        <>
                            <span>
                                <Link to="/signin">Sign In</Link>
                            </span>
                            <span>
                                <Link to="/signup">Sign Up</Link>
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className={noBg}>
                <div className="logoDiv">
                    <Link to="/" className="logoLink">
                        <img src="/logo.png" alt="Logo" className="Logo" />
                        <div className="slogan">
                            <div className="logoName">
                                Q-Airline
                            </div>
                            <div className="logoSlogan">
                            Euphoria in Every Flight
                            </div>
                        </div>
                    </Link>
                </div>

                <div className={active}>
                    <ul className="menu flex">
                        <li onClick={removeNavBar} className={`listItem ${isActive("/") ? "active" : ""}`}>
                            <Link to="/">Home</Link>
                        </li>
                        <li onClick={removeNavBar} className={`listItem ${isActive("/about-us") ? "active" : ""}`}>
                            <Link to="/about-us">About</Link>
                        </li>
                        <li onClick={removeNavBar} className={`listItem ${isActive("/offers") ? "active" : ""}`}>
                            <Link to="/offers">Offers</Link>
                        </li>
                        <li onClick={removeNavBar} className={`listItem ${isActive("/seats") ? "active" : ""}`}>
                            <Link to="/seats">Seats</Link>
                        </li>
                        <li onClick={removeNavBar} className={`listItem ${isActive("/destinations") ? "active" : ""}`}>
                            <Link to="/destinations">Destinations</Link>
                        </li>
                    </ul>

                    <button onClick={removeNavBar} className="btn flex btnOne">
                        Contact
                    </button>
                </div>

                <button className="btn flex btnTwo">
                    Contact
                </button>

                <div onClick={showNavBar} className="toggleIcon">
                    <CgMenuGridO className="icon" />
                </div>
            </div>
        </div>
    )
}

export default Navbar
