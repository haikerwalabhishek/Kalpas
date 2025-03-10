import { Buffer } from "buffer";

export const getImg = (imgUrl) => {
  try {
    const matches = imgUrl.match(/^data:(image\/\w+);base64,(.*)$/);
    
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid image format");
    }

    const mimeType = matches[1]; // k Extract MIME type (e.g., "image/png", "image/jpeg")
    const base64Data = matches[2]; // Extract actual base64 data
    const extension = mimeType.split("/")[1]; // Extract file extension (png, jpeg, etc.)
    const imageBuffer = Buffer.from(base64Data, "base64");

    return {
      buffer: imageBuffer,
      mimeType: mimeType,
      extension: extension,
    };

  } catch (error) {
    console.error("Error processing image:", error.message);
    return null;
  }
};
