import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../../../../admin/src/config/axiosInstance";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { dispatch } = useContext(AuthContext);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (token) {
            dispatch({ type: "LOGIN_SUCCESS", payload: { token } });
            navigate("/"); // Chuyển hướng nếu đã đăng nhập
        }
    }, [dispatch, navigate]);  

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        dispatch({ type: "LOGIN_START" });

        try {
            const res = await axiosInstance.post("/auth/login", { email, password });

            const { token, user } = res.data;

            if (rememberMe) {
                localStorage.setItem("authToken", token);
            } else {
                sessionStorage.setItem("authToken", token);
            }
            dispatch({ type: "LOGIN_SUCCESS", payload: user }); // Lưu thông tin người dùng vào AuthContext

            toast.success("Login successful! Redirecting to home page...");
            setTimeout(() => {
                navigate("/");
            }, 4000);
        } catch (err) {
            toast.error("Login failed. Please check your email and password.");
            console.log(err);
            dispatch({
                type: "LOGIN_FAILURE",
                payload: err.response?.data || { message: "Đăng nhập thất bại" },
            });
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
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/.test(password)) {
            newErrors.password = "Password must include at least one uppercase letter, one lowercase letter, and one special character.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="auth-page section container">
            <div className="auth-container">
                <h2>Sign In</h2>
                <p>Welcome back! Please log in to your account.</p>

                <form onSubmit={handleSubmit} className="form">
                    <div className="inputGroup">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
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
                    <button type="submit" className="btn">
                        Log In
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
