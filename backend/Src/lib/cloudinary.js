
import { v2 as cloudinary } from "cloudinary";


// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dj0l67xs6",
  api_key: process.env.CLOUDINARY_API_KEY || "474646853655316",
  api_secret: process.env.CLOUDINARY_API_SECRET || "1IA2tnEOz5X7nJdTP4xHPlVLOJk",
  
});



export default cloudinary
