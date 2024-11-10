import { writeFile } from "fs/promises";
import path from "path";

export async function uploadImage(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Generate a unique filename
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename =
    file.name.replace(/\.[^/.]+$/, "") +
    "-" +
    uniqueSuffix +
    path.extname(file.name);

  // Save the file
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);

  // Return the public URL
  return `/uploads/${filename}`;
}
