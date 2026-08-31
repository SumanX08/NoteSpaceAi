export function openCitationSource(
  source,
  citation
) {
  if (!source) {
    console.error(
      "Source not found"
    );

    return;
  }

  const type =
    source.type?.toLowerCase();

  // =========================
  // PDF
  // =========================

  if (type === "pdf") {
    const url =
      source.cloudinary?.url;

    if (!url) {
      console.error(
        "PDF URL not found"
      );

      return;
    }

    const page =
      citation.page || 1;

    window.open(
      `${url}#page=${page}`,
      "_blank"
    );

    return;
  }

  // =========================
  // YouTube
  // =========================

  if (type === "youtube") {
  const url = source.url;

  if (!url) {
    console.error(
      "YouTube URL not found"
    );

    return;
  }

  const startTime =
    Math.floor(
      (citation.startTime ?? 0) / 1000
    );

  const separator =
    url.includes("?")
      ? "&"
      : "?";

  window.open(
    `${url}${separator}t=${startTime}s`,
    "_blank"
  );

  return;
}

  // =========================
  // Website
  // =========================

  if (type === "website") {
    if (!source.url) {
      console.error(
        "Website URL not found"
      );

      return;
    }

    window.open(
      source.url,
      "_blank"
    );

    return;
  }

  // =========================
  // Cloudinary files
  // DOCX / Text / Transcript
  // =========================

  const fileUrl =
    source.cloudinary?.url;

  if (fileUrl) {
    window.open(
      fileUrl,
      "_blank"
    );

    return;
  }

  // =========================
  // Fallback
  // =========================

  if (source.url) {
    window.open(
      source.url,
      "_blank"
    );

    return;
  }

  console.error(
    "No source URL available",
    source
  );
}