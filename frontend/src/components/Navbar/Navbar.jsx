import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { SiConsul } from 'react-icons/si';
import { BsPhoneVibrate } from 'react-icons/bs';
import { AiOutlineGlobal } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { FaRegBell } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";

import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../config/axiosInstance";

import { formatDistanceToNow } from "date-fns";

const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true }); // Thêm "ago" hoặc "trước" vào cuối
};

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const navbarRef = useRef(null);
    const toggleButtonRef = useRef(null);

    const { user, dispatch } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const [bookingCount, setBookingCount] = useState(0);
    const [announcements, setAnnouncements] = useState([]);
    const [showAnnouncements, setShowAnnouncements] = useState(false);

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

        const fetchAnnouncements = async () => {
            if (user) {
                try {
                    const res = await axiosInstance.get(`/api/announcements/user/${user.id}`);
                    setAnnouncements(res.data);
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            }
        };

        fetchBookingCount();
        fetchAnnouncements();
    }, [user]); // Chạy khi user thay đổi

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // Nếu click nằm ngoài dropdown, ẩn dropdown
                setShowAnnouncements(false);
            }

            if (
                navbarRef.current && 
                !navbarRef.current.contains(event.target) &&
                toggleButtonRef.current &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                removeNavBar(); // Đóng navbar
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Remove the navbar in the small width screens
    const [active, setActive] = useState('navBarMenu');
    const showNavBar = (e) => {
        e.stopPropagation();
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

    const markAsRead = async (id) => {
        try {
            await axiosInstance.put(`/api/announcements/mark-read/${id}`);
            const res = await axiosInstance.get(`/api/announcements/user/${user.id}`);
            setAnnouncements(res.data);
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    console.log(announcements);
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

                            <div className="item" onClick={(e) => {
                                e.stopPropagation();
                                setShowAnnouncements((prev) => !prev);
                            }}>
                                {showAnnouncements ? (
                                    <FaBell className="icon activeBell" />
                                ) : (
                                    <FaRegBell className="icon" />
                                )}
                                <div className="counter">
                                    {announcements.filter((n) => !n.is_read).length}
                                </div>
                            </div>

                            {showAnnouncements && (
                                <div className="announcementsDropdown" ref={dropdownRef}>
                                    {announcements.length > 0 ? (
                                        announcements.map((noti) => (
                                            <div
                                                key={noti.user_notification_id}
                                                className={`announcementItem ${noti.is_read ? "read" : "unread"}`}
                                            >
                                                <div className="announcementContent">
                                                    <h4 className="announcementTitle">{noti.title}</h4>
                                                    <p className="announcementMessage">{noti.content}</p>
                                                    <span className="announcementTime">
                                                        {formatTimeAgo(noti.created_at)}
                                                    </span>
                                                </div>
                                                {!noti.is_read && (
                                                    <button
                                                        onClick={() => markAsRead(noti.user_notification_id)}
                                                        className="markReadBtn"
                                                    >
                                                        Mark as Read
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No announcements</p>
                                    )}
                                </div>
                            )}

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

                <div ref={navbarRef} className={active}>
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
                        <Link to="/contact">
                            Contact
                        </Link>
                    </button>
                </div>

                <button className="btn flex btnTwo">
                    <Link to="/contact">
                        Contact
                    </Link>
                </button>

                <div onClick={showNavBar} className="toggleIcon" ref={toggleButtonRef}>
                    <CgMenuGridO className="icon" />
                </div>
            </div>
        </div>
    )
}

export default Navbar
