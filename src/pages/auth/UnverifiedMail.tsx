import { assets } from "../../assets/icons";
import { toast } from "react-toastify";
import { useState } from "react";
import { Spinner } from "../../components/ui/spinner";
import { useLocation, useNavigate } from "react-router";
import { sendEmailVerification } from "@/api/services/auth.api";
import { isAxiosError } from "axios";
export function UnverifiedEmail() {
  const [isSendingLink, toggleIsSendingLink] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, verificationToken } =
    (location.state as {
      email?: string;
      verificationToken?: string;
    } | null) ?? {};

  const handleResend = async () => {
    if (!verificationToken) return;
    toggleIsSendingLink(true);
    try {
      await sendEmailVerification(verificationToken);
      toast.success("Sent verification link to email");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message ?? error.message);
      } else {
        toast.error((error as Error).message);
      }
    } finally {
      toggleIsSendingLink(false);
    }
  };

  return (
    <div className="auth-card-offset">
      <div className="auth-card">
        <div className="success-inner-stack h-fit">
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
              {email
                ? `Please verify ${email} using the link we sent before signing in.`
                : "Please verify your email using the link we sent before signing in."}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            {verificationToken && (
              <button
                type="button"
                className="btn-auth"
                disabled={isSendingLink}
                onClick={handleResend}
              >
                <span className="h-4.75 font-sans font-medium text-[16px] leading-4.75 text-white flex-none text-center">
                  {isSendingLink ? <Spinner /> : "Resend Verification Link"}
                </span>
              </button>
            )}
            <button
              type="button"
              className="btn-auth"
              onClick={() => navigate("/", { replace: true, state: null })}
            >
              <span className="h-4.75 font-sans font-medium text-[16px] leading-4.75 text-white flex-none text-center">
                Back to Sign In
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
