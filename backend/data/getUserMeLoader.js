import pool from '../config/database.js';
import jwt from "jsonwebtoken";

const blacklist = new Set();

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

  if (blacklist.has(token)) {
    return res.status(403).json({ message: "Token has been blacklisted." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
};