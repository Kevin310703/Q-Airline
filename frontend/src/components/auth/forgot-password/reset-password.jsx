import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import axiosInstance from "../../config/axiosInstance";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const token = searchParams.get("token");
    const navigate = useNavigate();

    const handleKeyDown = (e, nextInputId) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const nextInput = document.getElementById(nextInputId);
            if (nextInput) {
                nextInput.focus();
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            setMessage("Please fix the errors before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await axiosInstance.post("/auth/reset-password", { token, password });
            setMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/signin");
            }, 4000);
        } catch (err) {
            setMessage("Failed to reset password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.*\d)/.test(password)) {
            newErrors.confirmPassword = "Password must include at least one uppercase letter, one lowercase letter, one special character, and one number.";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required.";
        } else if (confirmPassword.length < 8) {
            newErrors.confirmPassword = "Confirm password must be at least 8 characters long.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.*\d)/.test(confirmPassword)) {
            newErrors.confirmPassword = "Confirm password must include at least one uppercase letter, one lowercase letter, one special character, and one number.";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Confirm password do not match.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="auth-page section">
            <div className="auth-container container">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit} className="form">
                    <div className="inputGroup">
                        <label htmlFor="password">New Password</label>
                        <div className="passwordWrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "confirmPassword")}
                                placeholder="Enter new password"
                                required
                            />
                            <span onClick={togglePasswordVisibility} className="togglePassword">
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="passwordWrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, "submitButton")}
                                placeholder="Confirm new password"
                                required
                            />
                            <span onClick={toggleConfirmPasswordVisibility} className="togglePassword">
                                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>
                    <button id="submitButton" type="submit" className="btn" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Reset Password"}
                    </button>
                </form>

                {message && (
                    <p className={`message ${message.includes("Failed") ? "error" : "success"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
