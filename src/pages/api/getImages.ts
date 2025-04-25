import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const imagesDirectory = path.join(process.cwd(), "public", "aboutImg");

  try {
    const imageFiles = fs.readdirSync(imagesDirectory);

    const images = imageFiles.map((file) => `/aboutImg/${file}`);

    res.status(200).json({ images });
  } catch (error) {
    console.error("Error reading images:", error);
    res.status(500).json({ error: "Failed to load images" });
  }
}