import api from "./api";

export const uploadSource = async (formData) => {
  return await api.post("/sources/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getSources = async (notebookId) => {
  return await api.get(`/sources/${notebookId}`);
};

export const getSourceStatus = async (sourceId) => {
  return await api.get(`/sources/${sourceId}/status`);
};

export const deleteSource = async (sourceId) => {
  return await api.delete(`/sources/${sourceId}`);
};