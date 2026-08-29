import axios from "axios";
import pdf from "pdf-parse/lib/pdf-parse.js";


export default async function extractPdf(source) {
  const url = source.cloudinary?.url;

  if (!url) {
    throw new Error(
      "Cloudinary PDF URL is missing."
    );
  }

  console.log(
    "Downloading PDF from Cloudinary..."
  );


  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 30000,
  });


  const buffer =
    Buffer.from(response.data);


  if (!buffer.length) {
    throw new Error(
      "Downloaded PDF is empty."
    );
  }


  // ----------------------------------
  // Extract each page separately
  // ----------------------------------

  const pages = [];


  const result = await pdf(buffer, {
    pagerender: async (pageData) => {
      const textContent =
        await pageData.getTextContent();


      const pageText =
        textContent.items
          .map((item) => item.str)
          .join(" ");


      pages.push({
        page: pageData.pageNumber,
        text: pageText,
      });


      return pageText;
    },
  });


  console.log(
    "PDF pages extracted:",
    pages.length
  );


  return {
    pages,
    totalPages:
      result.numpages,

    metadata:
      result.info || {},
  };
}