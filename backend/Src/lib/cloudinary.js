import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
import dotenv from "dotenv";
dotenv.config();




// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  
});

// const uploadImage = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;

//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });

//     console.log("Image uploaded successfully", response.url);

//     return response.url;
//   } catch (error) {
//     console.error("error uploading image:-", error);
//     if (fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//     }
//     //remove the local saved temp file after upload got failed

//     return null;
//   }
// };

export default cloudinary
