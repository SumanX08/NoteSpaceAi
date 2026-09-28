import api from "./api"

export const askQuestion = async (notebookId, question) => {
  return await api.post("/chat", {
    notebookId,
    question,
  });
};

export const searchMessages = async (
  notebookId,
  query
) => {
  return await api.get(
    `/chat/${notebookId}/search`,
    {
      params: {
        q: query,
      },
    }
  );
};