import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
  findUserByEmail,
  createUser,
  assignRoleToUser,
  findUserById,
  updateUserPassword,
  insertEmailVerificationToken
} from '../models/userModel.js';
import { getUserRole } from '../data/getUserMeLoader.js';
import { sendAccountVerificationEmail, sendPasswordResetEmail } from '../config/emailSender.js';

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

    // Gửi email xác thực
    const emailResponse = await sendAccountVerificationEmail(email, full_name, emailToken);

    if (emailResponse.success) {
      res.status(200).json({ message: 'Đăng ký thành công', userId, roleAssigned });
    } else {
      res.status(500).json({ message: 'Đăng ký thành công nhưng không thể gửi email xác nhận.', error: emailResponse.error });
    }
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const [result] = await pool.query("SELECT user_id FROM email_verifications WHERE token = ?", [token]);
    if (result.length === 0) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
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
      message: "Đăng nhập thành công",
      accessToken,
      user: {
        id: user.user_id,
        username: user.full_name,
        email: user.email,
        role: role.role_name,
      },
    });

    // res.status(200).json({
    //   message: 'Đăng nhập thành công',
    //   token,
    //   user: {
    //     id: user.user_id,
    //     username: user.full_name,
    //     email: user.email,
    //     avatar: user.avatar || null,
    //     dob: user.birth_date || null,
    //     phone: user.phone_number || null,
    //     country: user.country || null,
    //     address: user.address || null,
    //     role: role.role_name,
    //     isEmailVerified: user.is_email_verified,
    //     createdAt: user.created_at,
    //     updatedAt: user.updated_at,
    //   },
    // });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại trong hệ thống' });
    }

    // Tạo mật khẩu mới
    const generateStrongPassword = () => {
      const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lowercase = "abcdefghijklmnopqrstuvwxyz";
      const digits = "0123456789";
      const specialChars = "!@#$%^&*()_+[]{}|;:',.<>?";
      const allChars = uppercase + lowercase + digits + specialChars;

      const getRandomChar = (charset) => charset[Math.floor(Math.random() * charset.length)];

      let password = [
        getRandomChar(uppercase),      // Ít nhất 1 chữ cái hoa
        getRandomChar(lowercase),      // Ít nhất 1 chữ cái thường
        getRandomChar(digits),         // Ít nhất 1 chữ số
        getRandomChar(specialChars),   // Ít nhất 1 ký tự đặc biệt
      ];

      // Thêm các ký tự ngẫu nhiên để đạt chiều dài tối thiểu là 8
      for (let i = password.length; i < 8; i++) {
        password.push(getRandomChar(allChars));
      }

      // Trộn ngẫu nhiên mật khẩu để tăng tính bảo mật
      return password.sort(() => Math.random() - 0.5).join('');
    };

    const newPassword = generateStrongPassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu trong cơ sở dữ liệu
    await updateUserPassword(user.user_id, hashedPassword);

    // Gửi email với mật khẩu mới
    const emailResponse = await sendPasswordResetEmail(email, user.full_name, newPassword);

    if (emailResponse.success) {
      res.status(200).json({ message: 'Mật khẩu mới đã được gửi đến email của bạn.' });
    } else {
      res.status(500).json({ message: 'Không thể gửi email đặt lại mật khẩu.', error: emailResponse.error });
    }
  } catch (error) {
    console.error('Lỗi quên mật khẩu:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};