import { useNavigate } from "react-router";
import { assets } from "../../assets/icons";
import { auth } from "../../lib/firebaseConfig";
export function EmailVerified() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  if (!user) {
    navigate("/");
  } else if (!user.emailVerified) {
    navigate("/email-verification");
  }
  return (
    <div className="email-success-card">
      <div className="success-inner-stack">
        <img
          src={assets.verifiedEmail}
          alt="Success Checkmark"
          className="w-20 h-20 flex-none object-cover"
        />

        <div className="success-text-group">
          <h1 className="h-7.25 font-sans font-semibold text-[24px] leading-7.25 text-[#2D2D2D] flex-none text-center">
            Email Verified
          </h1>
          <p className="h-4.25 font-sans font-normal text-[14px] leading-4.25 text-[#89909D] flex-none text-center">
            Your email address has been successfully verified.
          </p>
        </div>

        <button
          type="button"
          className="btn-auth"
          onClick={() => navigate("#")}
        >
          <span className="h-4.75 font-sans font-medium text-[16px] leading-4.75 text-white flex-none text-center">
            Go to Dashboard
          </span>
        </button>
      </div>
    </div>
  );
}
