import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { type UserSignInPayload } from "../../types/user.signIn.payload.type";
import { CustomInput } from "../../components/common/customInput";
import { useEffect, useRef, useState } from "react";
import { userSignInSchema } from "../../validation/user.signIn.payload.schema";
import { toast } from "react-toastify";
import { Spinner } from "../../components/ui/spinner";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { updateUser } from "../../redux/slices/user.slice";
import { login } from "@/api/auth.api";
import { deviceType } from "@/types/api.requests.type";
import { setToken } from "@/redux/slices/auth.slice";
import { isAxiosError } from "axios";

export function SignInPage() {
  const rememberMe = useRef(0);
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const auth = useAppSelector((state) => state.auth);
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
    if (auth.apiToken.length >= 1) {
      navigate("/dashboard");
    }
  }, []);

  const onsubmit = async (data: UserSignInPayload) => {
    toggleIsSubmitting(true);
    try {
      const loginResponse = await login({
        email: data.email,
        password: data.password,
        device_type: deviceType.web,
      });
      dispath(setToken(loginResponse.payload.access_token));
      if (!loginResponse.payload.is_email_verified) {
        toast.error(`Please verify your email`);
        navigate("/email-verification");
      } else {
        dispath(updateUser(loginResponse.payload));
        toast.success(`Signin success`);
        navigate(`/dashboard`);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error(err.message);
      } else {
        toast.error(`Something went wrong`);
      }
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
