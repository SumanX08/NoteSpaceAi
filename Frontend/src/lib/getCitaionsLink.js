export function getCitationLink(
  source,
  citation
) {
  if (!source || !citation) {
    return null;
  }

  const type =
    citation.sourceType ||
    source.type;

  // PDF
  if (
    type === "pdf" &&
    source.fileUrl
  ) {
    if (citation.page) {
      return `${source.fileUrl}#page=${citation.page}`;
    }

    return source.fileUrl;
  }

  // YouTube
  if (
    type === "youtube" &&
    source.originalUrl
  ) {
    if (citation.startTime != null) {
      const separator =
        source.originalUrl.includes("?")
          ? "&"
          : "?";

      return `${source.originalUrl}${separator}t=${Math.floor(
        citation.startTime
      )}s`;
    }

    return source.originalUrl;
  }

  // Video
  if (
    type === "video" &&
    source.originalUrl
  ) {
    return source.originalUrl;
  }

  // Website
  if (
    type === "website" &&
    source.originalUrl
  ) {
    return source.originalUrl;
  }

  // Fallback
  return (
    source.originalUrl ||
    source.fileUrl ||
    null
  );
}