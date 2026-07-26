





export async function askQuestion(data) {
  const response = await API.post("/api/chat", data);
  return response.data;
}