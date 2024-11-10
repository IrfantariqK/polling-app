import tinify from "tinify";

tinify.key = process.env.TINIFY_API_KEY;

export async function optimizeImage(file) {
  const buffer = await file.arrayBuffer();
  const source = tinify.fromBuffer(buffer);
  const optimized = await source.toBuffer();

  // Here, you would typically upload the optimized image to a storage service
  // and return the URL. For this example, we'll just return a placeholder URL.
  return `https://api.tinify.com/optimized-image-${Date.now()}.jpg`;
}
