import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../../../../admin/src/config/axiosInstance";

interface FormData {
    full_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string,
    country: string,
    gender: string;
    dob: string;
}

interface Country {
    name: {
        common: string; // Tên quốc gia (hiển thị trên giao diện)
        official: string; // Tên chính thức của quốc gia
    };
    cca2: string; // Mã quốc gia 2 ký tự (ISO Alpha-2 code)
}

const SignUp = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { loading, error, dispatch } = useContext(AuthContext);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [formData, setFormData] = useState<FormData>({
        full_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        country: "",
        gender: "",
        dob: "",
    });

    const nameInputRef = useRef<HTMLInputElement>(null);
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch("https://restcountries.com/v3.1/all");
                const data: Country[] = await res.json(); // Ép kiểu dữ liệu trả về

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

    useEffect(() => {
        // Đặt focus khi trang tải
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    const capitalize = (text: string) => {
        return text
            .split(" ") // Tách thành mảng từ
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" "); // Ghép lại thành chuỗi
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "full_name" ? capitalize(value) : value,
        }));
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
            const res = await axiosInstance.post("/auth/register", formData);
            console.log(res);

            navigate("/verify-email");
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setMessage(err.response.data.message || "Email is already in use.");
            } else {
                setMessage("An error occurred while registering. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.full_name || formData.full_name.trim().length < 3) {
            newErrors.name = "Full name must be at least 3 characters long.";
        }

        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be a valid number with 10-15 digits.";
        }

        if (!formData.gender) {
            newErrors.gender = "Please select your gender.";
        }

        if (!formData.dob) {
            newErrors.dob = "Date of Birth is required.";
        } else if (new Date(formData.dob) >= new Date()) {
            newErrors.dob = "Date of Birth must be in the past.";
        }

        if (!formData.country) {
            newErrors.country = "Please select your country.";
        }

        if (!formData.address || formData.address.trim().length < 5) {
            newErrors.address = "Address must be at least 5 characters long.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.*\d)/.test(formData.password)) {
            newErrors.confirmPassword = "Password must include at least one uppercase letter, one lowercase letter, one special character, and one number.";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Password is required.";
        } else if (formData.confirmPassword.length < 8) {
            newErrors.confirmPassword = "Password must be at least 8 characters long.";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=.*\d)/.test(formData.confirmPassword)) {
            newErrors.confirmPassword = "Password must include at least one uppercase letter, one lowercase letter, one special character, and one number.";
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    console.log(countries);

    return (
        <div className="auth-page section container">
            <div className="auth-container">
                <h2>Sign Up</h2>
                <p>Create your account to get started!</p>

                {message && (
                    <p className={`message ${message.includes("failed") ? "error" : "success"}`}>
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="form">
                    <div className="inputGroup">
                        <label htmlFor="name">Full name</label>
                        <input
                            type="text"
                            id="name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            onKeyDown={(e) => handleKeyDown(e, "email")}
                            ref={nameInputRef}
                            required
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            onKeyDown={(e) => handleKeyDown(e, "phone")}
                            required
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="phone">Phone number</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            onKeyDown={(e) => handleKeyDown(e, "gender")}
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            onKeyDown={(e) => handleKeyDown(e, "birthDate")}
                            required
                        >
                            <option value="" disabled>
                                Select your gender
                            </option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && <span className="error-message">{errors.gender}</span>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="birthDate">Date of Birth</label>
                        <input
                            type="date"
                            id="birthDate"
                            name="dob"
                            value={formData.dob}
                            onKeyDown={(e) => handleKeyDown(e, "password")}
                            onChange={handleChange}
                        />
                        {errors.dob && <span className="error-message">{errors.dob}</span>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="country">Country</label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
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
                        {errors.country && <span className="error-message">{errors.country}</span>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            required
                        />
                        {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="password">Password</label>
                        <div className="passwordWrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                onKeyDown={(e) => handleKeyDown(e, "confirmPassword")}
                                required
                            />
                            <span onClick={togglePasswordVisibility} className="togglePassword">
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="password">Confirm password</label>
                        <div className="passwordWrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Enter your confirm password"
                                onKeyDown={(e) => handleKeyDown(e, "submitButton")}
                                required
                            />
                            <span onClick={toggleConfirmPasswordVisibility} className="togglePassword">
                                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>
                    <button id="submitButton" type="submit" className="btn" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Sign Up"}
                    </button>
                </form>

                <div className="separator">
                    <span>or</span>
                </div>

                <p>
                    Already have an account? <a href="/signin">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
