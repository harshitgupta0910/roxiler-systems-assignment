import api from "./api.js";

export async function fetchStores({ query, address }) {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (address) params.append("address", address);
  const { data } = await api.get(`/stores?${params.toString()}`);
  return data;
}

export async function fetchStore(id) {
  const { data } = await api.get(`/stores/${id}`);
  return data;
}

export async function createStore(payload) {
  const { data } = await api.post("/stores", payload);
  return data;
}
