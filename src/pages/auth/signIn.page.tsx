import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type UserSignInPayload } from "../../types/user.signIn.payload.type";
import { CustomInput } from "../../components/common/customInput";
import { useRef, useState } from "react";
import { userSignInSchema } from "../../validation/user.signIn.payload.schema";
import { signIn } from "../../lib/firebaseAuth";
import { showFirebaseError } from "../../lib/firebase.errors";
import { toast } from "react-toastify";
import { Spinner } from "../../components/ui/spinner";
import { useNavigate } from "react-router";

export function SignInPage() {
  const rememberMe = useRef(0);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<UserSignInPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(userSignInSchema),
  });

  const onsubmit = async (data: UserSignInPayload) => {
    toggleIsSubmitting(true);
    try {
      const userCredential = await signIn(data.email, data.password);
      navigate("create-user");
      if (!userCredential.user.emailVerified) {
        navigate("/email-verification");
      } else {
        toast("Sign in success", { type: "success" });
      }
    } catch (err) {
      showFirebaseError(err);
    } finally {
      toggleIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex justify-center z-10 -mt-8">
      <div className="flex flex-col items-start p-8 gap-8 isolate relative w-112.5 min-h-112.75 mx-auto mt-0 bg-white rounded-xl shadow-[0px_3px_12px_rgba(47,43,61,0.14)]">
        <div className="flex flex-col items-start p-0 gap-8 w-full max-w-96.5 min-h-96.75 self-stretch flex-none">
          <div className="flex flex-col items-center p-0 gap-2 w-full max-w-96.5 h-13.5 self-stretch flex-none">
            <span className="flex max-h-7.25 justify-center font-semibold text-2xl leading-[100%]">
              {" "}
              Welcome Back 👋{" "}
            </span>
            <span className="flex justify-center max-h-4.25 text-wrap font-normal text-[14px] leading-none tracking-normal text-[#89909D]">
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
              <div className="flex flex-row items-center p-0 gap-2 w-full max-w-96.5 h-5 self-stretch flex-none">
                <div className="flex flex-row items-center p-0 gap-2 w-full max-w-63.5 h-5 flex-none grow">
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
              <p className="h-4.75 font-sans font-normal text-[16px] leading-4.75 text-[#89909D] flex-none">
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
        </div>
      </div>
    </div>
  );
}
