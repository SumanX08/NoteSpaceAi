import api from "./api"

export const askQuestion = async (notebookId, question) => {
  return await api.post("/chat", {
    notebookId,
    question,
  });
};
