import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";
import AirlinesIcon from '@mui/icons-material/Airlines';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PlaceIcon from '@mui/icons-material/Place';

import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const { logout } = useContext(AuthContext);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const confirmLogout = () => {
    logout();
  };

  const cancelLogout = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Airline Dashboard</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>

          <p className="title">LISTS</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>

          <Link to="/airplanes" style={{ textDecoration: "none" }}>
            <li>
              <AirlinesIcon className="icon" />
              <span>Planes</span>
            </li>
          </Link>

          <Link to="/airplane-flights" style={{ textDecoration: "none" }}>
            <li>
              <AirplanemodeActiveIcon className="icon" />
              <span>Flights</span>
            </li>
          </Link>

          <Link to="/airports" style={{ textDecoration: "none" }}>
            <li>
              <ConnectingAirportsIcon className="icon" />
              <span>Airport</span>
            </li>
          </Link>

          <Link to="/tickets" style={{ textDecoration: "none" }}>
            <li>
              <AirplaneTicketIcon className="icon" />
              <span>Tickets</span>
            </li>
          </Link>

          <Link to="/booking-tickets" style={{ textDecoration: "none" }}>
            <li>
              <MdOutlineAirlineSeatReclineExtra className="icon" />
              <span>Booking</span>
            </li>
          </Link>

          <p className="title">USEFUL</p>
          <li>
            <NotificationsNoneIcon className="icon" />
            <Link to="/announcements" style={{ textDecoration: "none" }}>
              <span>Announcemens</span>
            </Link>
          </li>

          <p className="title">SERVICE</p>
          <Link to="/promotions" style={{ textDecoration: "none" }}>
            <li>
              <LocalOfferIcon className="icon" />
              <span>Offer</span>
            </li>
          </Link>

          <Link to="/destinations" style={{ textDecoration: "none" }}>
            <li>
              <PlaceIcon className="icon" />
              <span>Destination</span>
            </li>
          </Link>

          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li>

          <p className="title">USER</p>
          <Link to="/account" style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Profile</span>
            </li>
          </Link>

          <li onClick={handleLogout}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>

          {showConfirmation && (
            <div className="modal-overlay">
              <div className="modal">
                <p>Are you sure you want to log out?</p>
                <div className="modal-buttons">
                  <button className="btn-accept" onClick={confirmLogout}>
                    Yes
                  </button>
                  <button className="btn-denied" onClick={cancelLogout}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
