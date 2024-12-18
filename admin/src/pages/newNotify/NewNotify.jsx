import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axiosInstance from "../../config/axiosInstance";
import "./newNotify.css";
import { toast } from "react-toastify";

const NewNotify = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/api/users"); // API lấy danh sách người dùng
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleUserSelection = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedUsers(value);
  };

  const handleClick = async (e) => {
    e.preventDefault()
    try {
      const newNotification = {
        ...info,
        user_ids: selectedUsers,
      }
      console.log(newNotification);
      await axiosInstance.post("/api/announcements", newNotification);
      toast.success("Announcement sent successfully!");
      setInfo({}); // Làm trống form
    } catch (err) {
      console.error("Error sending notification:", err);
      toast.error("Failed to send announcement.");
    }
  }

  console.log(users);

  return (
    <div className="new-2">
      <Sidebar />
      <div className="newContainer-2">
        <Navbar />
        <div className="top-2">
          <h1>{title}</h1>
        </div>
        <div className="right-2">
          <form>
            {inputs.map((input) => (
              <div className="formInput-2" key={input.id}>
                <label>{input.label}</label>
                <input id={input.id} onChange={handleChange} type={input.type} placeholder={input.placeholder} />
              </div>
            ))}

            <div className="formInput-2">
              <label>Select Users</label>
              <select
                multiple
                onChange={handleUserSelection}
                className="userSelect"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <button onClick={handleClick} >Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewNotify;
