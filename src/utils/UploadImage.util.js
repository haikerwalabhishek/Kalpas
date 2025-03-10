import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import admin from "../configs/Firebase.config.js"; // Firebase config

const db = admin.firestore();
export const  upload = multer({ storage: multer.memoryStorage() });

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert file buffer to Base64
    const base64Image = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype; // Get image type (e.g., image/png)

    // Create a unique ID
    const imageId = uuidv4();

    // Store in Firestore
    await db.collection("images").doc(imageId).set({
      imageId,
      imageData: `data:${mimeType};base64,${base64Image}`, // Base64 image format
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      message: "Image uploaded successfully",
      imageId,
      imageUrl: `data:${mimeType};base64,${base64Image}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
