import {
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
  verifyPasswordResetCode,
  type User,
  type UserCredential,
} from "firebase/auth";
import { actionCodeSettings, auth, firebaseApp } from "./firebaseConfig";
import type { UserSignupPayload } from "../types/user.signup.payload.type";
import { getDatabase, ref, set } from "firebase/database";

export const saveUserToDb = async (
  uid: string,
  data: UserSignupPayload,
): Promise<void> => {
  try {
    const db = getDatabase(firebaseApp);
    await set(ref(db, `/users/${uid}`), data);
  } catch (err) {
    throw err;
  }
};

export const signUp = async (
  data: UserSignupPayload,
): Promise<UserCredential> => {
  try {
    const res = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    );
    await updateProfile(auth.currentUser as User, {
      displayName: data.email,
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const signIn = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (err) {
    throw err;
  }
};

export const sendVerificationLink = async (): Promise<void> => {
  try {
    await sendEmailVerification(auth.currentUser as User, actionCodeSettings);
  } catch (err) {
    throw err;
  }
};

export const verifyNewMail = async (newEmail: string): Promise<void> => {
  try {
    await verifyBeforeUpdateEmail(auth.currentUser as User, newEmail);
  } catch (err) {
    throw err;
  }
};

export const changeEmail = async (newEmail: string): Promise<void> => {
  try {
    await updateEmail(auth.currentUser as User, newEmail);
  } catch (err) {
    throw err;
  }
};

export const reAuthenticate = async (oldPassword: string): Promise<void> => {
  try {
    const credential = EmailAuthProvider.credential(
      auth.currentUser?.email ?? "",
      oldPassword,
    );
    await reauthenticateWithCredential(auth.currentUser as User, credential);
  } catch (err) {
    throw err;
  }
};

export const changePassword = async (newPassword: string): Promise<void> => {
  try {
    await updatePassword(auth.currentUser as User, newPassword);
  } catch (err) {
    throw err;
  } finally {
  }
};

export const passwordResetMail = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    throw err;
  }
};

export const userDelete = async (password: string): Promise<void> => {
  try {
    await reAuthenticate(password);
    await deleteUser(auth.currentUser as User);
  } catch (err) {
    throw err;
  }
};

export const verifyEmail = async (oobCode: string) => {
  try {
    await applyActionCode(auth, oobCode);
  } catch (err) {
    throw err;
  }
};

export const isPasswordResetCode = async (oobCode: string) => {
  try {
    await verifyPasswordResetCode(auth, oobCode);
  } catch (err) {
    throw err;
  }
};

export const resetPassword = async (oobCode: string, newPassword: string) => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
  } catch (err) {
    throw err;
  }
};
