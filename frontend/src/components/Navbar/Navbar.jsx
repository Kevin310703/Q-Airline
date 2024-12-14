import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { SiConsul } from 'react-icons/si';
import { BsPhoneVibrate } from 'react-icons/bs';
import { AiOutlineGlobal } from 'react-icons/ai';
import { CgMenuGridO } from 'react-icons/cg';
import { FaRegBell } from "react-icons/fa";

import Search from "../search/search";

import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, dispatch } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);

    // Remove the navbar in the small width screens
    const [active, setActive] = useState('navBarMenu');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái của menu

    const showNavBar = () => {
        setActive('navBarMenu showNavBar');
        setIsMenuOpen(true); // Mở menu
    };

    const hideNavBar = () => {
        setActive('navBarMenu');
        setIsMenuOpen(false); // Đóng menu
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Thay đổi trạng thái của menu khi nhấn icon
        setActive(isMenuOpen ? 'navBarMenu' : 'navBarMenu showNavBar'); // Thay đổi class tương ứng
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
        dispatch({ type: "LOGOUT" }); // Xử lý logout
        localStorage.removeItem("authToken"); // Xóa token khỏi localStorage
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const scrollToOffers = () => {
        const offersSection = Search;
        if (offersSection) {
          offersSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
    };

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
                                        <Link to="/account" className="dropdownItem">
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
                        <div>
                            <span>
                                <Link to="/signin">Sign In</Link>
                            </span>
                            <span>
                                <Link to="/signup">Sign Up</Link>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className={noBg}>
                <div className="logoDiv">
                    <div className="logoBlock">
                        <Link to="/" className="logoLink">
                            <img src="/logo.png" alt="Logo" className="Logo" />
                        </Link>
                        <div className="logoSlogan">Euphoria in Every Flight</div>
                    </div>
                    <div className="logoName">QAirLine</div>
                </div>

                <div className={active}>
                    <ul className="menu flex">
                        <li onClick={hideNavBar} className="listItem">
                            <Link to="/">Home</Link>
                        </li>
                        <li onClick={hideNavBar} className="listItem">
                            <Link to="/about_us">About</Link>
                        </li>
                        <li onClick={hideNavBar} className="listItem">
                            <Link to="/offers">Offers</Link>
                        </li>
                        <li onClick={hideNavBar} className="listItem">
                            <Link to="/seats">Seats</Link>
                        </li>
                        <li onClick={hideNavBar} className="listItem">
                            <Link to="/destinations">Destinations</Link>
                        </li>
                    </ul>

                    <button onClick={hideNavBar} className="btn flex btnOne">
                        Contact
                    </button>
                </div>

                <button className="btn flex btnTwo">
                    Contact
                </button>

                <div onClick={toggleMenu} className="toggleIcon">
                    <CgMenuGridO className="icon" />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
