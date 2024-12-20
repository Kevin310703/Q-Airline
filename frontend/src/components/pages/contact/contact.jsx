import React, { useState } from "react";
import axiosInstance from "../../config/axiosInstance";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        try {
            await axiosInstance.post("/api/contact", formData);
            setMessage("Thank you for reaching out to us! We'll get back to you shortly.");
            setFormData({ name: "", email: "", message: "" }); // Clear form
            setErrors({});
            setTimeout(() => {
                setMessage("");
            }, 2000);
        } catch (error) {
            setMessage("Failed to send your message. Please try again.");
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.message.trim()) {
            newErrors.message = "Message cannot be empty.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="contact section">
            <div className="container contactContainer">
                <h1 className="contactTitle">Contact Us</h1>

                <p className="contactSubtitle">
                    Have questions or need assistance? We're here to help!
                </p>

                <div className="contactContent">
                    {/* Contact Form */}
                    <div className="contactForm">
                        {message && (
                            <p className={`message ${message.includes("Failed") ? "error" : "success"}`}>
                                {message}
                            </p>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="formGroup">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && <p className="error-message">{errors.name}</p>}
                            </div>
                            <div className="formGroup">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <p className="error-message">{errors.email}</p>}
                            </div>
                            <div className="formGroup">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Your message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                />
                                {errors.message && <p className="error-message">{errors.message}</p>}
                            </div>
                            <button type="submit" className="btn">
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* Contact Details */}
                    <div className="contactDetails">
                        <h4>Get in Touch</h4>
                        <p>Email: support@qairline.com</p>
                        <p>Phone: +83-039-3997-459</p>
                        <p>Address: 144 Xuan Thuy, Dich Vong Hau, Cau Giay, Hanoi</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
