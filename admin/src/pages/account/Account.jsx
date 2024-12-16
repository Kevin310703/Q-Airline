import React, { useState, useContext } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./account.css";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosInstance";

const Account = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [file, setFile] = useState("");
  const [info, setInfo] = useState({});
  const [roles, setRoles] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();

        // Sắp xếp quốc gia theo tên
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, []);

  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    setInfo({
      username: user.username || "",
      email: user.email || "",
      dob: user.dob ? dayjs(user.dob).format("YYYY-MM-DD") : "",
      address: user.address || "",
      country: user.country || "",
      phone: user.phone || "",
      img: user.avatar || "",
      isEmailVerified: user.isEmailVerified || "",
      gender: user.gender || "",
      role: user?.role || "",
    });
  }, [user]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get("/api/roles");
        setRoles(res.data); // Lưu danh sách vai trò vào state
      } catch (err) {
        console.error("Lỗi khi lấy danh sách vai trò:", err);
      }
    };

    fetchRoles();
  }, []);

  console.log(roles);
  console.log(user);

  const handleInfoAccountClick = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    let imageUrl = info.avatar; // Giữ nguyên URL ảnh cũ

    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "upload");

      try {
        if (file) {
          // Chuyển đổi file sang Base64
          const base64 = await toBase64(file);

          // Gửi Base64 tới API upload
          const uploadRes = await axiosInstance.post("/api/upload-avatar", { image: base64, name_folder: "user_uploads" });

          imageUrl = uploadRes.data.url;
        }
      } catch (err) {
        console.log(err);
      }
    }

    const updateUser = {
      id: user.id,
      username: info.username,
      email: info.email,
      avatar: imageUrl, // Sử dụng URL ảnh mới hoặc cũ
      dob: info.dob ? dayjs(info.dob).format("YYYY-MM-DD") : "",
      phone: info.phone,
      country: info.country,
      address: info.address || "",
      isEmailVerified: info.isEmailVerified,
      gender: info.gender,
      role: info.role,
      isEmailVerified: user.is_email_verified,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    console.log(updateUser);

    try {
      await axiosInstance.put(`/api/users/${user.id}`, updateUser);
      dispatch({ type: "LOGIN_SUCCESS", payload: updateUser });
      localStorage.setItem("user", JSON.stringify(updateUser));

      toast.success("Updated account infomation successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 4000);
    } catch (err) {
      console.error("Lỗi khi tải lên ảnh:", err);
      toast.error("Đã xảy ra lỗi khi cập nhật người dùng!");
    }
  };

  // Chuyển file sang Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    try {
      await axiosInstance.put(`/api/users/${user.id}/changed-password`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Mật khẩu đã được thay đổi thành công!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      dispatch({ type: "LOGOUT" });

      // Điều hướng tới trang đăng nhập
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error("Lỗi khi thay đổi mật khẩu:", err);
      toast.error("Không thể thay đổi mật khẩu!");
    }
  };

  const validate = () => {
    const newErrors = {};

    // Kiểm tra username
    if (!info.username.trim()) {
      newErrors.username = "Username is required.";
    }

    // Kiểm tra email
    if (!info.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(info.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Kiểm tra số điện thoại
    if (!info.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10,15}$/.test(info.phone)) {
      newErrors.phone = "Phone number must be between 10-15 digits.";
    }

    // Kiểm tra địa chỉ
    if (!info.address.trim()) {
      newErrors.address = "Address is required.";
    }

    // Kiểm tra mật khẩu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    if (passwordData.oldPassword && !passwordRegex.test(passwordData.oldPassword)) {
      newErrors.oldPassword =
        "Password must be at least 6 characters, include an uppercase letter, a lowercase letter, and a special character.";
    }

    if (passwordData.newPassword && !passwordRegex.test(passwordData.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 6 characters, include an uppercase letter, a lowercase letter, and a special character.";
    }

    if (passwordData.confirmPassword && !passwordRegex.test(passwordData.confirmPassword)) {
      newErrors.confirmPassword =
        "Password must be at least 6 characters, include an uppercase letter, a lowercase letter, and a special character.";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  console.log(file);

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="account-page">
          <h2 className="account-title">Update Account Infomation</h2>
          <div className="user-img-container">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : info.img || "https://via.placeholder.com/100"
              }
              alt="Avatar"
              className="avatar-acc"
            />
            <input
              className="upload-input"
              type="file"
              id="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <form className="form-container" onSubmit={handleInfoAccountClick}>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                className="ip-acc"
                value={info.role || ""}
                onChange={handleChange}
              >
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_name}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="username">Fullname</label>
              <input
                type="text"
                id="username"
                className="ip-acc"
                value={info.username || ""}
                onChange={handleChange}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="ip-acc"
                value={info.email || ""}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dob"
                className="ip-acc"
                value={info.dob || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                className="ip-acc"
                value={info.address || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                className="ip-acc"
                value={info.country || ""}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select your country
                </option>
                {countries.map((country) => (
                  <option key={country.cca2} value={country.name.common}>
                    {country.name.common}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone number</label>
              <input
                type="text"
                id="phone"
                className="ip-acc"
                value={info.phone || ""}
                onChange={handleChange}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                className="ip-acc"
                value={info.gender || ""}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button className="btn-acc">
              Update Infomation
            </button>
          </form>

          <div className="divider">
            <hr />
          </div>

          {/* Form thay đổi mật khẩu */}
          <form className="form-container" onSubmit={handlePasswordSubmit}>
            <h2>Changed Password</h2>
            <div className="form-group">
              <label htmlFor="oldPassword">Current password</label>
              <div className="password-container">
                <input
                  type={showPasswords.oldPassword ? "text" : "password"}
                  id="oldPassword"
                  className="ip-acc"
                  placeholder="Enter current password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility("oldPassword")}
                >
                  {showPasswords.oldPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.oldPassword && (
                <span className="error-message">{errors.oldPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New password</label>
              <div className="password-container">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  id="newPassword"
                  className="ip-acc"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {showPasswords.newPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.newPassword && (
                <span className="error-message">{errors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm new password</label>
              <div className="password-container">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="ip-acc"
                  placeholder="Enter confirm password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {showPasswords.confirmPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
            <button className="btn-acc">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;
