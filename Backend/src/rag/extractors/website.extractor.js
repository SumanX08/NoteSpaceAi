import firecrawl
 from "../../config/firecrawl.js";
export default async function extractWebsite(source) {
  console.log(source)
  if (!source.title) {
    throw new Error("Website URL is required.");
  }

  const result = await firecrawl.scrape(source.title, {
    formats: ["markdown"],
  });

  if (!result?.markdown) {
    throw new Error("Firecrawl returned no content.");
  }

  return {
    text: result.markdown,

    title:
      result.metadata?.title ||
      source.title ||
      source.url,

    metadata: {
      url: source.title,
      description: result.metadata?.description,
      language: result.metadata?.language,
      source: "firecrawl",
    },
  };
}