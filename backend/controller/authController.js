import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
  findUserByEmail,
  createUser,
  assignRoleToUser,
  findUserById,
  updateUserPassword,
  insertEmailVerificationToken,
  insertResetPasswordToken,
} from '../models/userModel.js';
import pool from '../config/database.js';
import { getUserRole } from '../data/getUserMeLoader.js';
import { sendAccountVerificationEmail, sendPasswordResetEmail } from '../config/emailSender.js';
import dotenv from 'dotenv';
dotenv.config();

const blacklist = new Set();

export const register = async (req, res) => {
  const { full_name, email, password, phone, address, country, gender, dob, role, avatar } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo token xác thực email
    const emailToken = crypto.randomBytes(32).toString('hex');

    // Tạo người dùng mới
    const userId = await createUser(full_name, email, hashedPassword, phone, address, country, gender, dob, avatar);
    const roleToAssign = role || 'Customer';
    const roleAssigned = await assignRoleToUser(userId, roleToAssign);
    await insertEmailVerificationToken(userId, emailToken);

    const emailResponse = await sendAccountVerificationEmail(email, full_name, emailToken);
    console.log(emailResponse);

    // if (emailResponse.success) {
    res.status(200).json({
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.',
      userId,
      roleAssigned,
    });
    // } else {
    //   res.status(500).json({
    //     message: 'Đăng ký thành công nhưng không thể gửi email xác nhận.',
    //     error: emailResponse.error,
    //   });
    // }
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const [result] = await pool.query("SELECT user_id FROM email_verifications WHERE token = ?", [token]);
    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const userId = result[0].user_id;

    // Cập nhật trạng thái xác thực
    await pool.query("UPDATE users SET is_email_verified = TRUE WHERE user_id = ?", [userId]);

    // Xóa token
    await pool.query("DELETE FROM email_verifications WHERE token = ?", [token]);

    res.status(200).json({ message: "Xác nhận email thành công." });
  } catch (error) {
    console.error("Lỗi khi xác nhận email:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (!user.is_email_verified) {
      return res.status(403).json({ message: "Email chưa được xác minh. Vui lòng kiểm tra email của bạn." });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Lấy vai trò của người dùng
    const role = await getUserRole(user.user_id);

    const accessToken = jwt.sign(
      { id: user.user_id, role: role.role_name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Tạo JWT
    const refreshToken = jwt.sign(
      { id: user.user_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.status(200).json({
      message: 'Đăng nhập thành công',
      accessToken,
      user: {
        id: user.user_id,
        username: user.full_name,
        email: user.email,
        avatar: user.avatar || null,
        dob: user.birth_date || null,
        phone: user.phone_number || null,
        country: user.country || null,
        address: user.address || null,
        gender: user.gender || null,
        role: role.role_name,
        isEmailVerified: user.is_email_verified,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      blacklist.add(refreshToken); // Thêm vào blacklist
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const authenticateToken = async (req, res) => {
  console.log(req.user);
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized: User data not found" });
  }

  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token found." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token invalid:", error);
    res.status(403).json({ message: "Invalid or expired refresh token." });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    await insertResetPasswordToken(user.user_id, resetToken);
    await sendPasswordResetEmail(email, user.full_name, resetToken);

    res.status(200).json({ message: "Reset password email sent." });
  } catch (error) {
    console.error('Lỗi quên mật khẩu:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const [result] = await pool.query("SELECT user_id FROM password_reset WHERE token = ?", [token]);
    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await updateUserPassword(result[0].user_id, hashedPassword);
    await pool.query("DELETE FROM password_reset WHERE token = ?", [token]);

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ message: "Server error." });
  }
};
