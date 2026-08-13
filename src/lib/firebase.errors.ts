import { FirebaseError } from "firebase/app";
import { toast, type ToastOptions } from "react-toastify";

export const authErrors: Record<
  string,
  { msg: string; type: ToastOptions["type"] }
> = {
  "auth/requires-recent-login": {
    msg: "This operation is sensitive and requires you to log in again.",
    type: "info",
  },
  "auth/user-token-expired": {
    msg: "Your session has expired. Please sign in again.",
    type: "info",
  },

  "auth/user-not-found": {
    msg: "No account matches these credentials.",
    type: "error",
  },
  "auth/wrong-password": {
    msg: "The password you entered is incorrect.",
    type: "error",
  },
  "auth/email-already-in-use": {
    msg: "An account is already registered with this email address.",
    type: "warning",
  },
  "auth/account-exists-with-different-credential": {
    msg: "An account already exists with this email using a different sign-in method.",
    type: "warning",
  },
  "auth/user-disabled": {
    msg: "This user account has been disabled by an administrator.",
    type: "error",
  },

  "auth/invalid-email": {
    msg: "The email address format is invalid.",
    type: "warning",
  },
  "auth/invalid-credential": {
    msg: "The login credentials provided are expired or incorrect.",
    type: "error",
  },
  "auth/weak-password": {
    msg: "The password is too weak. It must be at least 6 characters.",
    type: "warning",
  },

  "auth/app-not-authorized": {
    msg: "This app is unauthorized to use Firebase Auth. Check your API keys and configuration.",
    type: "error",
  },
  "auth/unauthorized-domain": {
    msg: "This web domain is not authorized for login operations.",
    type: "error",
  },
  "auth/operation-not-allowed": {
    msg: "This sign-in provider is disabled for this project.",
    type: "error",
  },
  "auth/app-deleted": {
    msg: "The linked instance of Firebase App has been deleted.",
    type: "error",
  },
};

export const showFirebaseError = (error: unknown) => {
  if (error instanceof FirebaseError) {
    const { msg, type } = authErrors[error.code] ?? {
      msg: error.message,
      type: "error",
    };
    toast(msg, { type });
  }
};
