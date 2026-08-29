import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase/config";

export const registerWithFirebase = async (email, password) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
};

export const loginWithFirebase = async (email, password) => {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
};