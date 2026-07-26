import api from "./api";

export const getNotebooks = async () => {
  return await api.get("/notebooks");
};

export const getNotebookById = async (id) => {
  return await api.get(`/notebooks/${id}`);
};

export const createNotebook = async (data) => {
  return await api.post("/notebooks", data);
};

export const updateNotebook = async (id, data) => {
  return await api.put(`/notebooks/${id}`, data);
};

export const deleteNotebook = async (id) => {
  return await api.delete(`/notebooks/${id}`);
};