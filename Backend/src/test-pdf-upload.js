import "dotenv/config";
import fs from "fs/promises";
import {
  uploadPdfToCloudinary,
} from "./services/cloudinary.service.js";

const buffer = await fs.readFile("./test.pdf");

try {
  const result =
    await uploadPdfToCloudinary(
      buffer,
      "test.pdf"
    );

  console.log(
    "UPLOAD SUCCESS:"
  );

  console.dir(
    result,
    { depth: null }
  );
} catch (error) {
  console.error(
    "UPLOAD FAILED:"
  );

  console.error(error);
}