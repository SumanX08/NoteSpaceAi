import api from "./api";

export const generatePodcast = async (
  notebookId,
  {
    style,
    voice,
    duration,
  }
) => {
  return await api.post(
    `/podcasts/${notebookId}/generate`,
    {
      style,
      voice,
      duration: Number(duration),
    }
  );
};

export const getPodcasts = async (
  notebookId
) => {
  return await api.get(
    `/podcasts/${notebookId}`
  );
};