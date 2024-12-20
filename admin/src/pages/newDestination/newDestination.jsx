import "../new/new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";

import { useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";

const NewDestination = ({ inputs, title }) => {
    const [file, setFile] = useState("");
    const [info, setInfo] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fix the errors before submitting.');
            return;
        }

        try {
            let imageUrl = '';

            if (file) {
                // Chuyển đổi file sang Base64
                const base64 = await toBase64(file);

                // Gửi Base64 tới API upload
                const uploadRes = await axiosInstance.post("/api/upload-avatar", { image: base64, name_folder: "destination_uploads" });

                imageUrl = uploadRes.data.url;
            }

            const newDestination = {
                name: info.name,
                description: info.description,
                image_url: imageUrl || null,
                latitude: parseFloat(info.latitude),
                longitude: parseFloat(info.longitude),
            };

            await axiosInstance.post("/api/destinations", newDestination);
            toast.success("Destination created successfully!");

            setTimeout(() => {
                setInfo({});
                setFile(null);
            }, 4000);
        } catch (err) {
            console.error('Error creating promotion:', err);
            toast.error('An error occurred while creating the promotion.');
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

        if (!info.name || info.name.trim() === "") {
            newErrors.name = "Name is required.";
        }

        if (!info.description || info.description.trim() === "") {
            newErrors.description = "Description is required.";
        }

        if (!info.latitude || isNaN(info.latitude)) {
            newErrors.latitude = "Latitude must be a valid number.";
        }

        if (!info.longitude || isNaN(info.longitude)) {
            newErrors.longitude = "Longitude must be a valid number.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                file
                                    ? URL.createObjectURL(file)
                                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt=""
                        />
                    </div>
                    <div className="right">
                        <form>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    {input.type === "select" ? (
                                        <select
                                            id={input.id}
                                            value={info[input.id] || ""}
                                            onChange={handleChange}
                                        >
                                            {input.options.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            onChange={handleChange}
                                            type={input.type}
                                            placeholder={input.placeholder}
                                            id={input.id}
                                        />
                                    )}
                                    {errors[input.id] && (
                                        <span className="errorMessage">{errors[input.id]}</span>
                                    )}
                                </div>
                            ))}
                            <button onClick={handleClick}>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewDestination;