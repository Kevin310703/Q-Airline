import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../../../../admin/src/config/axiosInstance";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { dispatch } = useContext(AuthContext);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        console.log(token);

        const fetchUserData = async () => {
            try {

                if (!token) {
                    const res = await axiosInstance.post("/auth/refresh-token");
                    localStorage.setItem("authToken", res.data.accessToken);
                    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
                }

                if (token != null) {
                    const res = await axiosInstance.get("/auth/user-info", {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
                    navigate("/");
                }
            } catch (err) {
                console.error("Invalid token, logging out...");
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("authToken");
                dispatch({ type: "LOGOUT" });
            }
        };

        if (token != null) {
            fetchUserData();
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!validate()) {
            setMessage("Please fix the errors before submitting.");
            return;
        }

        dispatch({ type: "LOGIN_START" });
        setIsSubmitting(true);

        try {
            const res = await axiosInstance.post("/auth/login", { email, password });

            const { accessToken, user } = res.data;

            if (rememberMe) {
                localStorage.setItem("authToken", accessToken);
            } else {
                sessionStorage.setItem("authToken", accessToken);
                sessionStorage.setItem("user", JSON.stringify(user));
            }
            dispatch({ type: "LOGIN_SUCCESS", payload: user }); // Lưu thông tin người dùng vào AuthContext

            setMessage("Login successful! Redirecting to home page...");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            setMessage("Login failed. Please check your email and password.");
            console.log(err);
            dispatch({
                type: "LOGIN_FAILURE",
                payload: err.response?.data || { message: "Đăng nhập thất bại" },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.*\d)/.test(password)) {
            newErrors.confirmPassword = "Password must include at least one uppercase letter, one lowercase letter, one special character, and one number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="auth-page section container">
            <div className="auth-container">
                <h2>Sign In</h2>
                <p>Welcome back! Please log in to your account.</p>

                {message && (
                    <p className={`message ${message.includes("failed") ? "error" : "success"}`}>
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="form">
                    <div className="inputGroup">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            ref={emailInputRef}
                            required
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="password">Password</label>
                        <div className="passwordWrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <span onClick={togglePasswordVisibility} className="togglePassword">
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    <div className="options">
                        <label className="rememberMe">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            Remember Me
                        </label>
                        <a href="/forgot-password" className="forgotPassword">
                            Forgot Password?
                        </a>
                    </div>
                    <button type="submit" className="btn" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Log In"}
                    </button>
                </form>

                <div className="separator">
                    <span>or</span>
                </div>

                <p>
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
