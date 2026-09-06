export function normalizePodcast(podcast) {
  return {
    ...podcast,
    id: podcast.id || podcast._id,
    duration: `${podcast.duration} min`,
    progress:
      podcast.status === "ready"
        ? 100
        : 0,
    createdAt: formatDate(
      podcast.createdAt
    ),
  };
}

export function formatDate(date) {
  if (!date) {
    return "Just now";
  }

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Just now";
  }

  return value.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

export function formatSeconds(seconds) {
  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return "0:00";
  }

  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;

  return `${mins}:${String(secs).padStart(
    2,
    "0"
  )}`;
}