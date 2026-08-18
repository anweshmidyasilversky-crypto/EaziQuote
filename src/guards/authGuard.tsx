import { Navigate, Outlet } from "react-router";
import { auth } from "../lib/firebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import { Spinner } from "../components/ui/spinner";

export function AuthGuard() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      updateCurrentUser(auth, currentUser);
    });
    setIsLoading(false);
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Spinner />;
  } else {
    if (!auth.currentUser) {
      <Navigate to={"/"} replace={true} />;
    }
  }

  return <Outlet />;
}
