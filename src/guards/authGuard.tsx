import { Navigate, Outlet } from "react-router";
import { auth } from "../lib/firebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import { Spinner } from "../components/ui/spinner";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { updateUser } from "../redux/slices/user.slice";

export function AuthGuard() {
  // const [isLoading, setIsLoading] = useState(false);
  // const dispath = useAppDispatch();

  // useEffect(() => {
  //   setIsLoading(true);
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     updateCurrentUser(auth, currentUser);

  //     dispath(
  //       updateUser({
  //         name: currentUser?.email as string,
  //       }),
  //     );
  //   });
  //   setIsLoading(false);
  //   return () => unsubscribe();
  // }, []);

  // if (isLoading) {
  //   return <Spinner />;
  // } else {
  //   if (!auth.currentUser) {
  //     return <Navigate to={"/"} replace={true} />;
  //   }
  // }

  const user = useAppSelector((state) => state.user);

  if (user.email.length === 0) {
    return <Navigate to={"/"} replace={true} />;
  }

  return <Outlet />;
}
