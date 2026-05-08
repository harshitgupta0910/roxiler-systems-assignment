import { createUser, getUserById, getUsers, updatePassword } from "../services/user.service.js";

export async function listUsers(req, res, next) {
  try {
    const users = await getUsers({ query: req.query.q });
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function createUserHandler(req, res, next) {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updatePasswordHandler(req, res, next) {
  try {
    const result = await updatePassword(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
