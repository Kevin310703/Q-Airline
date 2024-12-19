import cloudinary from "../config/cloudinary.js";

export const uploadAvatarImage = async (req, res) => {
    try {
        const { image, name_folder } = req.body;
        
        if (!image) {
            return res.status(400).json({ message: "Không có hình ảnh được tải lên" });
        }

        // Tải lên hình ảnh tới Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: name_folder,
            transformation: [{ width: 500, height: 500, crop: "limit" }],
        });

        // Trả về URL của hình ảnh đã tải lên
        res.status(200).json({ url: uploadResponse.secure_url });
    } catch (err) {
        console.error("Lỗi khi tải lên ảnh:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi tải ảnh lên." });
    }
};