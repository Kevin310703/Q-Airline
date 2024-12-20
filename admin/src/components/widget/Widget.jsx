import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AirlinesIcon from '@mui/icons-material/Airlines';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";

const Widget = ({ type }) => {
  const [amount, setAmount] = useState(0);
  const [diff, setDiff] = useState(0);
  let data;

  useEffect(() => {
    const fetchData = async () => {
      try {
        switch (type) {
          case "user":
            const usersRes = await axiosInstance.get("/api/users");
            console.log(usersRes);
            setAmount(usersRes.data.length);
            setDiff(usersRes.data.percentageChange || 0);
            break;
          case "booking":
            const bookingsRes = await axiosInstance.get("/api/booking-tickets");
            setAmount(bookingsRes.data.length);
            setDiff(bookingsRes.data.percentageChange || 0);
            break;
          case "earning":
            const earningsRes = await axiosInstance.get("/api/tickets/booking/earnings");
            setAmount(Math.round(earningsRes.data.total));
            setDiff(earningsRes.data.percentageChange || 0);
            break;
          case "airplane":
            const airplanesRes = await axiosInstance.get("/api/airplanes");
            setAmount(airplanesRes.data.length);
            setDiff(airplanesRes.data.percentageChange || 0);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error fetching data for widget:", error);
      }
    };

    fetchData();
  }, [type]);

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        linkto: "/users",
        link: "See all users",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "booking":
      data = {
        title: "BOOKING",
        isMoney: false,
        linkto: "/booking-tickets",
        link: "View all bookings",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        isMoney: true,
        linkto: "/earnings",
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "airplane":
      data = {
        title: "AIRPLANE",
        isMoney: false,
        linkto: "/airplanes",
        link: "See details",
        icon: (
          <AirlinesIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  console.log(amount);
  console.log(diff);

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
        </span>
        <Link to={data.linkto} className="link-to">
          <span className="link">{data.link}</span>
        </Link>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
