import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type UserSignInPayload } from "../../types/user.signIn.payload.type";
import { CustomInput } from "../../components/common/CustomInput";
import { useEffect, useRef, useState } from "react";
import { userSignInSchema } from "../../validation/user.signIn.payload.schema";
import { signIn } from "../../lib/firebaseAuth";
import { showFirebaseError } from "../../lib/firebase.errors";
import { toast } from "react-toastify";
import { Spinner } from "../../components/ui/spinner";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { useAppDispatch } from "../../redux/store";
import { updateUser } from "../../redux/slices/user.slice";
import { auth } from "../../lib/firebaseConfig";

export function SignInPage() {
  const rememberMe = useRef(0);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispath = useAppDispatch();
  const { control, handleSubmit } = useForm<UserSignInPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(userSignInSchema),
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      navigate("");
    }
  }, []);

  const onsubmit = async (data: UserSignInPayload) => {
    toggleIsSubmitting(true);
    try {
      const userCredential = await signIn(data.email, data.password);
      dispath(
        updateUser({
          email: userCredential.user.email as string,
        }),
      );
      if (!userCredential.user.emailVerified) {
        navigate("/email-verification");
      } else {
        toast.success("Sign in success");
        console.log("Going to profile setup");
        navigate("/profile-setup");
      }
    } catch (err) {
      showFirebaseError(err);
    } finally {
      toggleIsSubmitting(false);
    }
  };

  return (
    <div className="auth-card-offset">
      <Card className="auth-card ring-0">
        <CardContent className="flex flex-col items-start p-0 gap-8 w-full max-w-96.5 min-h-96.75 self-stretch flex-none">
          <div className="flex flex-col items-center p-0 gap-2 w-full max-w-96.5 h-13.5 self-stretch flex-none">
            <span className="flex max-h-7.25 justify-center font-semibold text-2xl leading-[100%]">
              {" "}
              Welcome Back 👋{" "}
            </span>
            <span className="flex justify-center max-h-4.25 text-wrap font-normal text-[12px] md:text-[14px] lg:text-[14px] leading-none tracking-normal text-[#89909D]">
              {" "}
              Log in to manage your quotes and invoices with ease.{" "}
            </span>
          </div>

          <div className="flex flex-col items-center p-0 gap-5 w-full max-w-96.5 min-h-75.25 self-stretch flex-none">
            <form
              onSubmit={handleSubmit(onsubmit)}
              className="flex flex-col items-center p-0 gap-5 w-full max-w-96.5 min-h-75.25 self-stretch flex-none"
            >
              <CustomInput
                control={control}
                name="email"
                fieldName="Email"
                inptType="text"
                placeholder="Enter your email"
              />

              <CustomInput
                control={control}
                name="password"
                fieldName="Password"
                inptType="password"
                placeholder="Enter your password"
              />

              {/* Remember me and forgot password */}
              <div className="flex flex-row items-center p-0 md:gap-2 w-full max-w-96.5 h-5 self-stretch flex-none">
                <div className="flex flex-row items-center p-0 gap-2 md:w-full md:max-w-63.5 h-5 grow">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    value={rememberMe.current}
                    className="h-5 w-5"
                    onClick={() => (rememberMe.current ^= 1)}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>

                <a
                  onClick={() => navigate("/forgot-password")}
                  className=" h-4.75 font-normal text-[16px] leading-4.75 text-brand-dark flex-none hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="btn-auth"
              >
                {isSubmitting ? <Spinner /> : "Sign in"}
              </button>
              <p className="flex gap-1 items-center h-4.75 font-sans font-normal text-[16px] leading-4.75 text-[#89909D] flex-none">
                Don’t have an account?{" "}
                <a
                  onClick={() => navigate("/signup")}
                  className="text-brand-dark font-medium hover:underline"
                >
                  Create Account
                </a>
              </p>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
