import api from "./api.js";

export async function createRating(payload) {
  const { data } = await api.post("/ratings", payload);
  return data;
}

export async function updateRating(id, payload) {
  const { data } = await api.put(`/ratings/${id}`, payload);
  return data;
}

export async function fetchRatingsByStore(storeId) {
  const { data } = await api.get(`/ratings/store/${storeId}`);
  return data;
}
