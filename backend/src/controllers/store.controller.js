import { createStore, getStoreById, getStores } from "../services/store.service.js";

export async function listStores(req, res, next) {
  try {
    const stores = await getStores({
      query: req.query.q,
      address: req.query.address,
      userId: req.user?.id
    });
    res.json(stores);
  } catch (error) {
    next(error);
  }
}

export async function getStore(req, res, next) {
  try {
    const store = await getStoreById(req.params.id, req.user?.id);
    res.json(store);
  } catch (error) {
    next(error);
  }
}

export async function createStoreHandler(req, res, next) {
  try {
    const store = await createStore(req.body);
    res.status(201).json(store);
  } catch (error) {
    next(error);
  }
}
