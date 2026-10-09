import { assets } from "../../assets/icons";
import { Outlet, useNavigate } from "react-router";
import { DashboardSidebarButton } from "./DashboardSidebarButton";
import { useState } from "react";
import { persistor, useAppDispatch, useAppSelector } from "../../redux/store";
import { CustomAvatar } from "../common/CustomAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import useAuthMutation from "@/hooks/apis/auth/useAuthMutation";
import { toast } from "react-toastify";
import { releaseToken } from "@/redux/slices/auth.slice";
import { removeUser } from "@/redux/slices/user.slice";
import { showErrorToast } from "@/api/axiosInstance";
import { Spinner } from "../ui/spinner";
import CustomDialog from "../common/CustomDialog";
import { cn } from "@/lib/utils";
import { CircleArrowOutUpLeft, Menu, X } from "lucide-react";
import { CustomBtn } from "../common/CustomBtn";
import DeleteDialog from "../common/DeleteDialog";
import { removeQuote } from "@/redux/slices/quotes.slice";
import ContactSupportBox from "../common/ContactSupportBox";
export function DashboardLayout() {
  const { logoutMutation, userDeleteMutation } = useAuthMutation();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [activeBtn, toggleActiveBtn] = useState<string>("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [ticketCreateDialogOpen, setTicketCreateDialogOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const endDate = new Date(user.subscription_ended_at ?? new Date());
  const btnIcon = (btnId: string, activeIcon: string, inActiveIcon: string) =>
    btnId === activeBtn ? activeIcon : inActiveIcon;

  const btnConfig: {
    id: string;
    label: string;
    activeBtn: string;
    inactiveBtn: string;
    clickHandler?: () => void;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      activeBtn: assets.dashboardHomeActiveIcon,
      inactiveBtn: assets.dashboardHomeIcon,
      clickHandler: () => navigate("/dashboard"),
    },
    {
      id: "quotes",
      label: "Quotes",
      activeBtn: assets.quotesActiveIcon,
      inactiveBtn: assets.quotesIcon,
      clickHandler: () => navigate("/quotes"),
    },
    {
      id: "invoices",
      label: "Invoices",
      activeBtn: assets.invoiceActiveIcon,
      inactiveBtn: assets.invoiceIcon,
      clickHandler: () => navigate("/invoices"),
    },
    {
      id: "clients",
      label: "Clients",
      activeBtn: assets.clientActiveIcon,
      inactiveBtn: assets.clientIcon,
      clickHandler: () => {
        navigate("/clients");
      },
    },
    {
      id: "payments",
      label: "Payments",
      activeBtn: assets.poundActiveIcon,
      inactiveBtn: assets.poundIcon,
      clickHandler: () => {
        navigate("/payments");
      },
    },
    {
      id: "preset-quotes",
      label: "Preset Quotes",
      activeBtn: assets.presetQuotesActiveIcon,
      inactiveBtn: assets.presetQuotesIcon,
      clickHandler: () => navigate("/preset-quotes"),
    },
    {
      id: "settings",
      label: "Settings",
      activeBtn: assets.settingsActiveIcon,
      inactiveBtn: assets.settingsIcon,
      clickHandler: () => navigate("/settings"),
    },
  ];

  const handleUserDelete = () => {
    userDeleteMutation.mutate(undefined, {
      onSuccess: (response) => {
        toast.success(response.message);
        dispatch(releaseToken());
        dispatch(removeUser());
        persistor.purge();
        navigate("/");
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: (response) => {
        toast.success(response.message);
        dispatch(releaseToken());
        dispatch(removeUser());
        dispatch(removeQuote());
        persistor.purge();
        navigate("/");
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <div
        className={cn(
          "bg-sidebar h-full shrink-0 overflow-y-auto border-r-sidebar-border border-r-[0.5px] md:static md:inset-auto md:z-auto md:w-63 md:max-w-63",
          mobileSidebarOpen
            ? "fixed inset-0 z-50 w-full max-w-none"
            : "w-12 max-w-12",
        )}
      >
        {!mobileSidebarOpen && (
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={mobileSidebarOpen}
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        )}

        <div className={cn("hidden md:block", mobileSidebarOpen && "block")}>
          <div className="flex justify-center items-center mb-5 cursor-pointer">
            <img
              src={assets.sidebarLogo}
              className="h-6 mt-6 md:max-w-32.5 self-center"
              onClick={() => {
                navigate("/dashboard");
                setMobileSidebarOpen(false);
              }}
            />
            {mobileSidebarOpen && (
              <button
                type="button"
                className="absolute right-0 flex h-12 w-12 items-center justify-center md:hidden"
                aria-label="Close navigation menu"
                aria-expanded={mobileSidebarOpen}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>

          <div className="w-full flex flex-col gap-5 p-6 pl-4.5 justify-center items-center">
            {btnConfig.map((btn) => {
              return (
                <DashboardSidebarButton
                  key={btn.id}
                  id={btn.id}
                  toggleActive={toggleActiveBtn}
                  currActive={activeBtn}
                  leftIcon={btnIcon(btn.id, btn.activeBtn, btn.inactiveBtn)}
                  clickHandler={() => {
                    btn.clickHandler?.();
                    setMobileSidebarOpen(false);
                  }}
                  buttonLabel={btn.label}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full h-full min-w-0 min-h-0">
        <div className="w-full border-b-sidebar-border border-b-[0.5px] min-h-17.5 shrink-0 flex items-center px-6">
          {/* Header content spaced between */}
          <div className="w-full min-h-fit flex justify-between gap-2 items-center">
            {/* Subscription end detail */}
            <div className="w-80.25 min-h-8 flex gap-3 items-center">
              {!user.is_subscription_active && (
                <>
                  <span className="max-h-4.75 w-auto max-w-53 font-sans text-xs md:text-sm text-placeholder-text flex items-center min-w-20 py-2">
                    {user.is_trial_period &&
                      `Free trial ends on ${endDate.toLocaleString("en-Gb", { dateStyle: "medium" })}`}
                    {!user.is_trial_period &&
                      `${user.is_subscription_active ? `Plan ends on ${endDate.toLocaleString("en-Gb", { dateStyle: "medium" })}` : "Your subscription has expired"} `}
                  </span>

                  <button
                    className="btn-auth flex items-center justify-center h-full min-h-8 w-fit md:min-w-24.25 md:max-w-24.25 py-2 px-3 gap-2 rounded-0.5 bg-sidebar-btn"
                    onClick={() => navigate(`/subscribe-plan`)}
                  >
                    <span className="font-sans text-sm">Subscribe</span>
                    <img src={assets.arrowRight} className="max-h-2 max-w-1" />
                  </button>
                </>
              )}
            </div>

            <div className="h-full w-auto max-w-67.5 flex md:gap-6 items-center">
              <div className="flex items-center gap-2 md:gap-5 max-h-10">
                <button
                  className="min-h-5 min-w-5 flex items-center"
                  onClick={() => setTicketCreateDialogOpen(true)}
                >
                  <img src={assets.headphoneIcon} className="w-4 h-5" />
                </button>

                <button
                  className="min-h-5 min-w-5 flex items-center"
                  onClick={() => navigate(`/dashboard/notifications`)}
                >
                  <img src={assets.bellIcon} className="h-4.5 w-4" />
                </button>
              </div>

              {/* Logged in user */}
              <Popover>
                <PopoverTrigger className={`translate-y-0!`}>
                  <div className="flex flex-col md:flex-row p-4.5 gap-3 items-center bg-header-user-det overflow-hidden">
                    <CustomAvatar
                      src={user.avatar ?? assets.userIconSvg}
                      fallback="U"
                    />
                    <span className="font-sans font-medium text-[14px] min-h-4.25 max-w-21.5 text-wrap">
                      {user.name}
                    </span>
                  </div>
                </PopoverTrigger>

                {/* Delete user & logout */}
                <PopoverContent
                  className={`w-fit ring-0 shadow-none dashboard-card-theme p-2 rounded-2 [&_div]:cursor-pointer`}
                  align="center"
                  side="bottom"
                >
                  <div className="flex flex-col gap-1">
                    <span
                      className="py-2 px-4 flex gap-2 items-center"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      {userDeleteMutation.isPending ? (
                        <Spinner className="text-brand-dark" />
                      ) : (
                        <img src={assets.binIconBlack} className="w-3.5 h-4" />
                      )}
                      {"Delete Account"}
                    </span>

                    <span
                      className="py-2 px-4 flex gap-2 items-center"
                      onClick={() => setLogoutModalOpen(true)}
                    >
                      {logoutMutation.isPending ? (
                        <Spinner className="text-brand-dark" />
                      ) : (
                        <img
                          src={assets.logoutIconBlack}
                          className="w-3.5 h-4"
                        />
                      )}
                      {"Logout"}
                    </span>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="bg-dashboard w-full flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      <ContactSupportBox
        isOpen={ticketCreateDialogOpen}
        toggleIsOpen={setTicketCreateDialogOpen}
      />

      {/* Logout modal */}
      <CustomDialog
        dialogOpen={logoutModalOpen}
        toggleDialogOpen={setLogoutModalOpen}
        isSubmitting={logoutMutation.isPending}
        withHeader={false}
      >
        <div className="min-w-fit md:min-w-125 flex flex-col gap-8 items-center justify-center py-5">
          <CircleArrowOutUpLeft className="text-brand-dark w-12 h-12 -rotate-45" />

          <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="text-black text-2xl"> {"Logout"} </h1>
            <span className="text-placeholder-text text-sm [@media(min-width:375px)_and_(max-width:767px)]:text-center">
              {" "}
              {"Are you sure you want to logout?"}{" "}
            </span>
          </div>

          <div className="flex gap-2">
            <CustomBtn
              buttonLabel="Close"
              onClick={() => setLogoutModalOpen(false)}
              className="bg-slate-100 hover:bg-slate-300 text-black-text"
            />

            <CustomBtn
              buttonLabel="Logout"
              onClick={handleLogout}
              isSubmitting={logoutMutation.isPending}
            />
          </div>
        </div>
      </CustomDialog>

      {/* Delete Modal */}
      <DeleteDialog
        isOpen={deleteModalOpen}
        toggleOpen={setDeleteModalOpen}
        deleteAction={handleUserDelete}
        isPending={userDeleteMutation.isPending}
        dialogHeader="Delete Account"
        dialogDescription="Are you sure you want to delete your account?"
      />
    </div>
  );
}
