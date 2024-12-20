import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (to, subject, content) => {
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to,           // Người nhận
        subject,      // Tiêu đề
        html: content,
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            console.log(error);
        } else {
            console.log("Email sent successfully!");
        }
    })
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
            <a href="http://localhost:5173/verify-email?token=${token}" 
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

export const sendPasswordResetEmail = async (to, username, resetToken) => {
    const subject = 'Reset Your Password';
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    const content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">Hello, ${username}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
                We received a request to reset your password.
                <br />
                If you did not make this request, please ignore this email. Otherwise, you can reset your password using the link below:
            </p>
            <a href="${resetLink}" 
                style="display: inline-block; background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
            </a>
            <p style="font-size: 16px; line-height: 1.6; color: #555; margin-top: 20px;">
                If the button above does not work, copy and paste this link into your browser:
                <br />
                <a href="${resetLink}">${resetLink}</a>
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

export const sendContactMessage = async (name, email, message) => {
    const subject = `New Contact Message from ${name}`;
    const content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #333;">New Contact Message</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #555;">
                <strong>From:</strong> ${name} (${email})<br />
                <strong>Message:</strong><br />
                ${message}
            </p>
            <p style="font-size: 14px; color: #999; margin-top: 20px;">
                Best regards,
                <br />
                The Q-Airline Contact System.
            </p>
        </div>
    `;
    return await sendEmail(process.env.SMTP_MAIL, subject, content);
};
