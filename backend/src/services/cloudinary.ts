import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

export async function uploadBuffer(buffer: Buffer, folder: string) {
  return new Promise<{
    public_id: string;
    url: string;
    secure_url: string;
    resource_type: string;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}
