import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (to, subject, content) => {
    const transporter = createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_AUTH_USER,
        to,           // Người nhận
        subject,      // Tiêu đề
        html: content,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email', error };
    }
};

export const sendAccountVerificationEmail = async (to, username, token) => {
    const subject = 'Verify Your Account';
    const content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Welcome, ${username}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
                Thank you for signing up for our service.
                <br />
                Please click the button below to verify your account:
            </p>
            <a href="http://localhost:5173/verify-account?token=${token}" 
                style="display: inline-block; background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Verify Account
            </a>
            <p style="font-size: 14px; color: #999; margin-top: 20px;">
                Best regards,
                <br />
                The Support Q-Airline Team.
            </p>
        </div>
    `;
    return await sendEmail(to, subject, content);
};

export const sendPasswordResetEmail = async (to, username, newPassword) => {
    const subject = 'Your Password Has Been Reset';
    const content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Hello, ${username}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
                Your password has been successfully reset.
                <br />
                Here is your new password:
                <strong>${newPassword}</strong>
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
                Please log in and change your password immediately to ensure account security.
            </p>
            <p style="font-size: 14px; color: #999; margin-top: 20px;">
                Best regards,
                <br />
                The Support Q-Airline Team.
            </p>
        </div>
    `;
    return await sendEmail(to, subject, content);
};
