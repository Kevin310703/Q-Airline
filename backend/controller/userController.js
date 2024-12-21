import pool from "../config/database.js";
import bcrypt from 'bcryptjs';
import { findUserById } from '../models/userModel.js';
import { createAnnouncement } from '../models/announcementModel.js';

export const getUsers = async (req, res) => {
    try {
        // Query lấy danh sách người dùng
        const [rows] = await pool.query(
            `SELECT u.user_id AS id, u.full_name AS username, u.email, 
              u.avatar, u.birth_date, u.phone_number AS phone, 
              u.country, u.address, u.gender, u.is_email_verified, 
              ur.role_id, r.role_name AS role, 
              u.created_at, u.updated_at
             FROM users u
             LEFT JOIN user_roles ur ON u.user_id = ur.user_id
             LEFT JOIN roles r ON ur.role_id = r.role_id`
        );

        // Kiểm tra nếu không có người dùng
        if (rows.length === 0) {
            return res.status(404).json({ message: "Không có người dùng nào được tìm thấy." });
        }

        // Trả về danh sách người dùng
        res.status(200).json(rows);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        res.status(500).json({ message: "Lỗi máy chủ." });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT u.user_id AS id, u.full_name AS username, u.email, 
                u.avatar, u.birth_date AS dob, u.phone_number AS phone, 
                u.country, u.address, u.gender, u.is_email_verified, 
                ur.role_id, r.role_name AS role, 
                u.created_at, u.updated_at
             FROM users u
             LEFT JOIN user_roles ur ON u.user_id = ur.user_id
             LEFT JOIN roles r ON ur.role_id = r.role_id
             WHERE u.user_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        res.status(200).json(rows[0]); // Trả về thông tin người dùng
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết người dùng:", error);
        res.status(500).json({ message: "Lỗi máy chủ." });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        // Cập nhật thông tin người dùng
        const [result] = await pool.query(
            `UPDATE users SET full_name = ?, email = ?, avatar = ?, phone_number = ?, birth_date = ?, 
            country = ?, address = ?, gender = ? WHERE user_id = ?`,
            [
                updatedData.username,
                updatedData.email,
                updatedData.avatar,
                updatedData.phone,
                updatedData.dob,
                updatedData.country,
                updatedData.address,
                updatedData.gender,
                id,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Nếu có role trong request body, xử lý cập nhật vai trò
        if (updatedData.role) {
            const [roleResult] = await pool.query(
                `SELECT role_id FROM roles WHERE role_name = ?`,
                [updatedData.role]
            );

            if (roleResult.length === 0) {
                return res.status(400).json({ message: "Vai trò không hợp lệ" });
            }

            const roleId = roleResult[0].role_id;

            const [userRoleResult] = await pool.query(
                `SELECT * FROM user_roles WHERE user_id = ?`,
                [id]
            );

            if (userRoleResult.length > 0) {
                await pool.query(
                    `UPDATE user_roles SET role_id = ? WHERE user_id = ?`,
                    [roleId, id]
                );
            } else {
                await pool.query(
                    `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
                    [id, roleId]
                );
            }
        }

        // Nếu có mật khẩu mới, thực hiện băm và cập nhật mật khẩu
        if (updatedData.password) {
            const bcrypt = require("bcrypt");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(updatedData.password, salt);

            await pool.query(
                `UPDATE users SET password_hash = ? WHERE user_id = ?`,
                [hashedPassword, id]
            );
        }

        await createAnnouncement({
            title: "Profile update successful",
            content: "Your account information has been updated successfully.",
            user_ids: [id],
            sender_id: null,
        });

        // Gửi phản hồi thành công sau khi tất cả các thao tác hoàn tất
        res.status(200).json({ message: "Cập nhật thông tin người dùng thành công" });
    } catch (err) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
};

export const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await findUserById(id);
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không chính xác!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const [result] = await pool.query(
            "UPDATE users SET password_hash = ? WHERE user_id = ?",
            [hashedPassword, id]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ message: "Cập nhật mật khẩu thất bại." });
        }

        await createAnnouncement({
            title: "Password changed",
            content: "Your account password has been successfully updated.",
            user_ids: [id],
            sender_id: null,
        });

        res.status(200).json({ message: "Mật khẩu đã được thay đổi!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Kiểm tra người dùng tồn tại
        const [user] = await pool.query("SELECT * FROM users WHERE user_id = ?", [id]);
        if (user.length === 0) {
            return res.status(404).json({ message: "Người dùng không tồn tại." });
        }

        await pool.query(
            "DELETE t FROM tickets t INNER JOIN bookings b ON t.booking_id = b.booking_id WHERE b.user_id = ?",
            [id]
        );
        
        await pool.query("DELETE FROM bookings WHERE user_id = ?", [id]);

        // Xóa vai trò liên kết với người dùng
        await pool.query("DELETE FROM user_roles WHERE user_id = ?", [id]);

        // Xóa người dùng
        const [result] = await pool.query("DELETE FROM users WHERE user_id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Không thể xóa người dùng." });
        }

        res.status(200).json({ message: "Xóa người dùng thành công." });
    } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        res.status(500).json({ message: "Lỗi máy chủ." });
    }
};