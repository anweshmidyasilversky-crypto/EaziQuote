import { Outlet } from "react-router";
import { assets } from "../../assets/icons";

export function AuthLayout() {
  return (
    <div className="bg-auth min-h-screen min-w-screen">
      <div className="w-full max-h-[14.62rem] flex justify-center items-center relative overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={assets.loginHeader}
          alt="Header Background"
        />

        <div className="absolute flex justify-center items-center z-10 my-9">
          <img className="max-w-[10.34rem] h-8" src={assets.logo} alt="Logo" />
        </div>
      </div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
