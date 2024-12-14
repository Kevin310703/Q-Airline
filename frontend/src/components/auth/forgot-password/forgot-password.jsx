import React, { useState } from "react";
import axiosInstance from "../../config/axiosInstance";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        setEmail(e.target.value);
        setMessage("");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await axiosInstance.post("/auth/forgot-password", { email });
            setMessage("A reset password link has been sent to your email.");
        } catch (err) {
            setMessage("Failed to send reset password email. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="auth-page section">
            <div className="auth-container container">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit} className="form">
                    <div className="inputGroup">
                        <label htmlFor="email">Enter your email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleInputChange}
                            onKeyDown={(e) => handleKeyDown(e, "submitButton")}
                            placeholder="Enter your registered email"
                            required
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <button id="submitButton" type="submit" className="btn" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
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

export default ForgotPassword;
