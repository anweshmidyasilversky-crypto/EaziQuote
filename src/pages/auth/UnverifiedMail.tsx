import { assets } from "../../assets/icons";
import { SignInPage } from "./SigninPage";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/ui/spinner";
import { useAppSelector } from "@/redux/store";
import { sendEmailVerification } from "@/api/auth.api";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
export function UnverifiedEmail() {
  const [isSendingLink, toggleIsSendingLink] = useState(false);
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.is_email_verified) {
      navigate("/", { replace: true });
    }
  }, []);

  const handleClick = async () => {
    toggleIsSendingLink(true);
    try {
      await sendEmailVerification();
      toast.success("Sent verification link to email");
    } catch (err) {
      console.log(isAxiosError(err), err);
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message);
      } else {
        toast.error((err as Error).message);
      }
    } finally {
      toggleIsSendingLink(false);
    }
  };
  return (
    <div className="auth-card-offset">
      <div className="auth-card">
        <div className="success-inner-stack">
          <img
            src={assets.unverifiedEmail}
            alt="Success Checkmark"
            className="w-20 h-20 flex-none object-cover"
          />

          <div className="success-text-group">
            <h1 className="h-7.25 font-sans font-semibold text-[24px] leading-7.25 text-black-text flex-none text-center">
              "Email Unverified"
            </h1>
            <p className="h-4.25 font-sans font-normal text-[14px] leading-4.25 text-[#89909D] flex-none text-center">
              "Please verify your email before login."
            </p>
          </div>

          <button type="button" className="btn-auth" onClick={handleClick}>
            <span className="h-4.75 font-sans font-medium text-[16px] leading-4.75 text-white flex-none text-center">
              {isSendingLink ? <Spinner /> : "Send Verification Link"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
