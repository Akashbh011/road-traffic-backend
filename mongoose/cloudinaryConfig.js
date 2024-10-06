// cloudinary.config.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({ 
    cloud_name: 'dcuspsijt', 
    api_key: '521453689811132', 
    api_secret: 'CRWhgJOMe8Gonn4Ini5f93Ylvc0' // Click 'View API Keys' above to copy your API secret
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Folder in Cloudinary
    format: async () => "jpg", // Change to match your image type (png, jpg, etc.)
    public_id: (req, file) => file.originalname, // Use the original file name
  },
});

// Export the configured Cloudinary instance and storage
export { cloudinary, storage };
