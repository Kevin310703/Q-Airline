import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("");
    const [isVerifying, setIsVerifying] = useState(false); // Trạng thái xác thực
    const navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                setIsVerifying(true); // Bắt đầu xác thực
                await axiosInstance.post("/auth/verify-email", { token });
                setMessage("Your email has been successfully verified!");
                // setTimeout(() => {
                //     navigate("/signin");
                // }, 44000);
            } catch (err) {
                setMessage("Verification failed. The link may be expired or invalid.");
            } finally {
                setIsVerifying(false); // Kết thúc xác thực
            }
        };

        if (token) {
            verifyEmail(); // Thực hiện xác thực nếu có token
        } else {
            setMessage("A verification link has been sent to your email. Please check your inbox.");
        }
    }, [token, navigate]);

    return (
        <div className="email-verification">
            <h1>{message}</h1>
            {isVerifying && <p>Verifying your email, please wait...</p>}
        </div>
    );
};

export default VerifyEmail;
