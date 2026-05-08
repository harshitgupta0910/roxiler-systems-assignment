import api from "./api.js";

export async function fetchUsers(query = "") {
  const { data } = await api.get(`/users${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  return data;
}

export async function createUser(payload) {
  const { data } = await api.post("/users", payload);
  return data;
}
