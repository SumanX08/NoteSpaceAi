import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export default async function extractWebsite(source) {
  const response = await axios.get(source.content.url, {
    timeout: 15000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  const dom = new JSDOM(response.data);

  const article = new Readability(dom.window.document).parse();

  if (!article) {
    throw new Error("Failed to extract website content.");
  }

  return {
    text: article.textContent,
    title: article.title,
    metadata: {
      url: source.url,
      length: article.length,
      excerpt: article.excerpt,
    },
  };
}