import "dotenv/config";
import cloudinary from "./config/cloudinary.js";

console.log("Starting Cloudinary test...");

console.log({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKeyExists: !!process.env.CLOUDINARY_API_KEY,
  apiSecretExists: !!process.env.CLOUDINARY_API_SECRET,
});

try {
  const result = await cloudinary.api.ping();

  console.log("Cloudinary connection successful:");
  console.log(result);
} catch (error) {
  console.error("Cloudinary connection failed:");
  console.error(error);
}