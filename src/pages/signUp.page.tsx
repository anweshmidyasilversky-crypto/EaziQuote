import { useForm } from "react-hook-form";
import { type UserSignupPayload } from "../types/user.signup.payload.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserSignupPayloadSchema } from "../validation/user.signup.payload.schema";
import { useRef, useState } from "react";
import { CustomInput } from "../components/common/customInput";
import { Spinner } from "../components/ui/spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import {
  saveUserToDb,
  sendVerificationLink,
  signUp,
} from "../lib/firebaseAuth";
import { showFirebaseError } from "../lib/firebase.errors";

export function SignupPage() {
  const [isSubmitting, toggleIsSubmitting] = useState(false);
  const tcAccept = useRef(0);
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<UserSignupPayload>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(UserSignupPayloadSchema),
  });

  const onsubmit = async (data: UserSignupPayload) => {
    if (!tcAccept.current) {
      toast("Please accept T&C to continue", { type: "error" });
      return;
    }
    toggleIsSubmitting(true);
    try {
      const userCredential = await signUp(data);
      await saveUserToDb(userCredential.user.uid, data);
      await sendVerificationLink();
      toast(`Signup Success, Sent verification mail`, { type: "success" });
      navigate("/");
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
              Let’s Get Started 🚀{" "}
            </span>
            <span className="flex justify-center max-h-4.25 text-wrap font-normal text-[14px] leading-none tracking-normal text-[#89909D]">
              {" "}
              Sign up and simplify your quoting and invoicing process.{" "}
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

              <CustomInput
                control={control}
                name="confirmPassword"
                fieldName="Confirm Password"
                inptType="password"
                placeholder="Re-enter password"
              />

              {/* Remember me and forgot password */}
              <div className="flex flex-row items-center p-0 gap-2 w-full max-w-96.5 h-5 self-stretch flex-none">
                <div className="flex flex-row items-center p-0 gap-2 w-full h-5 flex-none grow">
                  <input
                    type="checkbox"
                    id="tNc"
                    value={tcAccept.current}
                    className="h-5 w-5"
                    onClick={() => (tcAccept.current ^= 1)}
                  />
                  <label htmlFor="tNc">
                    I agree to the Terms & Conditions and Privacy Policy
                  </label>
                </div>
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="btn-auth"
              >
                {isSubmitting ? <Spinner /> : "Sign Up"}
              </button>
              <p className="h-4.75 font-sans font-normal text-[16px] leading-4.75 text-[#89909D] flex-none">
                Already have an account?
                <a
                  onClick={() => navigate("/")}
                  className="text-brand-dark font-medium hover:underline"
                >
                  Sign In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
