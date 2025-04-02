import pool from '../config/database.js';

// Lấy thông tin thanh toán theo booking_id
export const getPaymentByBookingId = async (req, res) => {
    const { booking_id } = req.params;

    try {
        const [result] = await pool.query(
            `
            SELECT 
                payment_id,
                amount,
                payment_method,
                payment_date,
                paypal_order_id
            FROM 
                payments
            WHERE 
                booking_id = ?
            `,
            [booking_id]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error fetching payment by booking ID:", error);
        res.status(500).json({ message: "Server error" });
    }
};