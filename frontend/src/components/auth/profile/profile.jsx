import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosInstance";

const Profile = () => {
    const navigate = useNavigate();
    const { user, dispatch, logout } = useContext(AuthContext);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [previewAvatar, setPreviewAvatar] = useState(user.avatar || "/default-avatar.png");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword((prev) => !prev);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    // Xử lý thay đổi mật khẩu
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await axiosInstance.put(`/api/users/${user.id}/changed-password`, {
                oldPassword: currentPassword,
                newPassword: newPassword,
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setMessage("Password changed successfully!. Please sign in again.");
            setTimeout(() => {
                navigate("/");
                handleLogout;
            }, 2000);
        } catch (error) {
            setMessage("Failed to change password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!currentPassword) {
            newErrors.currentPassword = "Current password is required.";
        } else if (currentPassword.length < 8) {
            newErrors.currentPassword = "Current password must be at least 8 characters long.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.*\d)/.test(currentPassword)) {
            newErrors.currentPassword = "Current password must include at least one uppercase letter, one lowercase letter, one special character, and one number.";
        }

        if (!newPassword) {
            newErrors.newPassword = "New password is required.";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "New password must be at least 8 characters long.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.*\d)/.test(newPassword)) {
            newErrors.newPassword = "New password must include at least one uppercase letter, one lowercase letter, one special character, and one number.";
        }

        if (!confirmNewPassword) {
            newErrors.confirmNewPassword = "Confirm new password is required.";
        } else if (confirmNewPassword.length < 8) {
            newErrors.confirmNewPassword = "Confirm new password must be at least 8 characters long.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.*\d)/.test(confirmNewPassword)) {
            newErrors.confirmNewPassword = "Confirm new password must include at least one uppercase letter, one lowercase letter, one special character, and one number.";
        } else if (confirmNewPassword !== newPassword) {
            newErrors.confirmNewPassword = "Confirm new password do not match.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/auth/logout");
            logout();
        } catch (error) {
            toast.error("Failed to logout. Please try again.");
        }
    };

    const handleKeyDown = (e, nextInputId) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const nextInput = document.getElementById(nextInputId);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        if (!selectedAvatar) {
            setMessage("Please select an avatar to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", selectedAvatar);

        setIsSubmitting(true);
        try {
            const res = await axiosInstance.put(`/api/users/${user.id}/avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            dispatch({ type: "UPDATE_AVATAR", payload: res.data.avatar });
            setMessage("Avatar updated successfully!");
        } catch (error) {
            setMessage("Failed to upload avatar. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedAvatar(file);
            setPreviewAvatar(URL.createObjectURL(file));
        } else {
            setMessage("Please upload a valid image file.");
        }
    };

    return (
        <div className="profile-page section container">
            <div className="profile-container">
                <h2>Your Profile</h2>
                <div className="profile-info">
                    <div className="avatar">
                        <img src={previewAvatar} alt="User Avatar" />
                        <form onSubmit={handleAvatarUpload} className="avatar-form">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="file-input"
                            />
                            <button type="submit" className="btn" disabled={isSubmitting}>
                                {isSubmitting ? "Uploading..." : "Update Avatar"}
                            </button>
                        </form>
                    </div>
                    <div className="details">
                        <p><strong>Name:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
                        <p><strong>Address:</strong> {user.address || "Not provided"}</p>
                        <p><strong>Country:</strong> {user.country || "Not provided"}</p>
                        <p><strong>Gender:</strong> {user.gender}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <Link to="/edit-profile" className="btn edit-btn">Edit Profile</Link>
                    </div>
                </div>

                <div className="change-password">
                    <h3>Change Password</h3>

                    {message && (
                        <p className={`message ${message.includes("Failed") ? "error" : "success"}`}>
                            {message}
                        </p>
                    )}

                    <form onSubmit={handlePasswordChange}>
                        <div className="inputGroup">
                            <label htmlFor="currentPassword">Current Password</label>
                            <div className="passwordWrapper">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, "newPassword")}
                                    placeholder="Enter current password"
                                    required
                                />
                                <span onClick={toggleCurrentPasswordVisibility} className="togglePassword">
                                    {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                            {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="passwordWrapper">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, "confirmNewPassword")}
                                    placeholder="Enter new password"
                                    required
                                />
                                <span onClick={toggleNewPasswordVisibility} className="togglePassword">
                                    {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="confirmNewPassword">Confirm New Password</label>
                            <div className="passwordWrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, "submitButton")}
                                    placeholder="Confirm new password"
                                    required
                                />
                                <span onClick={toggleConfirmPasswordVisibility} className="togglePassword">
                                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>
                            {errors.confirmNewPassword && <span className="error-message">{errors.confirmNewPassword}</span>}
                        </div>
                        <button id="submitButton" type="submit" className="btn" disabled={isSubmitting}>
                            {isSubmitting ? "Changing Password..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;