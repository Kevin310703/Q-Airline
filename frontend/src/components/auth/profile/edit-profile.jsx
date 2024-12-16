import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const EditProfile = () => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: user.username || "",
        avatar: user.avatar || "",
        email: user.email || "",
        dob: user.dob ? dayjs(user.dob).format("YYYY-MM-DD") : "",
        phone: user.phone || "",
        address: user.address || "",
        country: user.country || "",
        isEmailVerified: user.isEmailVerified || "1",
        gender: user.gender || "Other",
    });

    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState(user.avatar || "/default-avatar.png");
    const [selectedAvatar, setSelectedAvatar] = useState(null);

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

    useEffect(() => {
        return () => {
            if (previewAvatar && previewAvatar.startsWith("blob:")) {
                URL.revokeObjectURL(previewAvatar);
            }
        };
    }, [previewAvatar]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        let imageUrl = previewAvatar; // Giữ nguyên URL ảnh cũ

        if (selectedAvatar) {
            const data = new FormData();
            data.append("file", selectedAvatar);
            data.append("upload_preset", "upload");

            try {
                // Chuyển đổi file sang Base64
                const base64 = await toBase64(selectedAvatar);

                // Gửi Base64 tới API upload
                const uploadRes = await axiosInstance.post("/api/upload-avatar", { image: base64, name_folder: "user_uploads" });

                imageUrl = uploadRes.data.url;
            } catch (err) {
                console.log(err);
            }
        }

        const updateUser = {
            id: user.id,
            username: formData.username || "",
            avatar: imageUrl,
            email: formData.email || "",
            dob: formData.dob ? dayjs(formData.dob).format("YYYY-MM-DD") : "",
            phone: formData.phone || "",
            address: formData.address || "",
            country: formData.country || "",
            isEmailVerified: formData.isEmailVerified || "1",
            gender: formData.gender || "Other",
            role: user.role,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };

        try {
            await axiosInstance.put(`/api/users/${user.id}`, updateUser);
            dispatch({ type: "LOGIN_SUCCESS", payload: updateUser });
            localStorage.setItem("user", JSON.stringify(updateUser));

            setMessage("Profile updated successfully!");
            setTimeout(() => {
                navigate("/profile");
            }, 2000);
        } catch (error) {
            setMessage("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
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

    const validate = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = "Name is required.";
        }

        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setSelectedAvatar(file);
            setPreviewAvatar(URL.createObjectURL(file));
            setFormData({ ...formData, avatar: file });
        } else {
            setMessage("Please upload a valid image file.");
        }
    };

    const handleBack = () => {
        navigate("/profile"); // Điều hướng về trang Profile
    };

    return (
        <div className="edit-profile-page section container">
            <div className="edit-profile-container">
                <h2>Edit Profile</h2>

                {message && (
                    <p className={`message ${message.includes("Failed") ? "error" : "success"}`}>
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="inputGroup">
                        <div className="avatar">
                            <img src={previewAvatar} alt="User Avatar" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="file-input"
                            />
                        </div>
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="username">Full Name</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            required
                        />
                        {errors.username && <span className="error-message">{errors.username}</span>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter your address"
                        />
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="country">Country</label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
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

                    <div className="inputGroup">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="button-group">
                        <button type="button" className="btn back-btn" onClick={handleBack}>
                            Back to Profile
                        </button>
                        <button type="submit" className="btn">
                            {isSubmitting ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
