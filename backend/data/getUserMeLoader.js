import pool from '../config/database.js';
import jwt from "jsonwebtoken";

export const getUserRole = async (userId) => {
  try {
    const [result] = await pool.query(
      `SELECT u.user_id, u.full_name, u.email, r.role_name
       FROM users u
       JOIN user_roles ur ON u.user_id = ur.user_id
       JOIN roles r ON ur.role_id = r.role_id
       WHERE u.user_id = ?`,
      [userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại hoặc chưa được gán vai trò' });
    }

    return result[0];
  } catch (error) {
    console.error('Lỗi khi lấy vai trò người dùng:', error);
    throw error;
  }
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Gắn thông tin từ token vào req.user
      next();
  } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(403).json({ message: "Invalid or expired token" });
  }
};