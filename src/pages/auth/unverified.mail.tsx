import { assets } from "../../assets/icons";
import { auth } from "../../lib/firebaseConfig";
import { SignInPage } from "./signIn.page";
import { toast } from "react-toastify";
import { sendVerificationLink } from "../../lib/firebaseAuth";
import { showFirebaseError } from "../../lib/firebase.errors";
import { useState } from "react";
import { Spinner } from "../../components/ui/spinner";
export function UnverifiedEmail() {
  const user = auth.currentUser;
  const [isSendingLink, toggleIsSendingLink] = useState(false);
  if (!user) {
    return <SignInPage />;
  }

  const handleClick = async () => {
    toggleIsSendingLink(true);
    try {
      await sendVerificationLink();
      toast("Sent verification link to email", { type: "success" });
    } catch (err) {
      showFirebaseError(err);
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
            <h1 className="h-7.25 font-sans font-semibold text-[24px] leading-7.25 text-[#2D2D2D] flex-none text-center">
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
