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
import useSupportMutation from "@/hooks/apis/support/useSupportMutation";
import type { SupportTicketCreatePayload } from "@/types/api.requests.type";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supportTicketCreateSchema } from "@/validation/supportTicket.create.payload.schema";
import CustomDialog from "../common/CustomDialog";
import { CustomCombobox } from "../common/CustomCombobox";
import { cn } from "@/lib/utils";
import { CustomInput } from "../common/CustomInput";
import { CircleArrowOutUpLeft } from "lucide-react";
import { CustomBtn } from "../common/CustomBtn";
import DeleteDialog from "../common/DeleteDialog";
export function DashboardLayout() {
  const { logoutMutation, userDeleteMutation } = useAuthMutation();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [activeBtn, toggleActiveBtn] = useState<string>("dashboard");
  const [ticketCreateDialogOpen, setTicketCreateDialogOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const config = useAppSelector((state) => state.appConfig);
  const endDate = new Date(user.subscription_ended_at ?? new Date());
  const btnIcon = (btnId: string, activeIcon: string, inActiveIcon: string) =>
    btnId === activeBtn ? activeIcon : inActiveIcon;
  const { ticketCreateMutation } = useSupportMutation();

  const [ticketAreaSearchTerm, setTicketAreaSearchTerm] = useState("");
  const {
    control,
    reset,
    clearErrors,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<SupportTicketCreatePayload>({
    defaultValues: {
      support_ticket_area_id: undefined,
      description: undefined,
      other_area: undefined,
    },
    resolver: yupResolver(supportTicketCreateSchema),
  });

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
        persistor.purge();
        navigate("/");
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  const handleTicketCreation = (payload: SupportTicketCreatePayload) => {
    ticketCreateMutation.mutate(payload, {
      onSuccess: (response) => {
        toast.success(response.message);
        setTicketCreateDialogOpen(false);
        reset();
        setTicketAreaSearchTerm("");
      },
      onError: (error) => {
        showErrorToast(error);
      },
    });
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <div className="bg-sidebar sm:w-auto md:w-63 max-w-63 h-full shrink-0 overflow-y-auto border-r-sidebar-border border-r-[0.5px]">
        <div className="flex justify-center items-center mb-10 cursor-pointer">
          <img
            src={assets.sidebarLogo}
            className="h-6 mt-6 md:max-w-32.5"
            onClick={() => navigate("/dashboard")}
          />
        </div>

        <div className="flex flex-col gap-5 p-6 pl-4.5 justify-center items-center">
          {btnConfig.map((btn) => {
            return (
              <DashboardSidebarButton
                key={btn.id}
                id={btn.id}
                toggleActive={toggleActiveBtn}
                currActive={activeBtn}
                leftIcon={btnIcon(btn.id, btn.activeBtn, btn.inactiveBtn)}
                clickHandler={btn.clickHandler}
                buttonLabel={btn.label}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col w-full h-full min-w-0 min-h-0">
        <div className="w-full border-b-sidebar-border border-b-[0.5px] min-h-17.5 shrink-0 flex items-center px-6">
          {/* Header content spaced between */}
          <div className="w-full min-h-fit flex justify-between gap-2 items-center">
            {/* Subscription end detail */}
            <div className="w-80.25 min-h-8 flex gap-3 items-center">
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
            </div>

            <div className="h-full w-auto max-w-67.5 flex gap-6 items-center">
              <div className="flex items-center max-h-10">
                <button
                  className="h-10 w-10 flex items-center"
                  onClick={() => setTicketCreateDialogOpen(true)}
                >
                  <img src={assets.headphoneIcon} className="w-4 h-5" />
                </button>

                <button
                  className="h-10 w-10 flex items-center"
                  onClick={() => navigate(`/dashboard/notifications`)}
                >
                  <img src={assets.bellIcon} className="h-4.5 w-4" />
                </button>
              </div>

              {/* Logged in user */}
              <Popover>
                <PopoverTrigger className={`translate-y-0!`}>
                  <div className="flex p-4.5 gap-3 items-center bg-header-user-det overflow-hidden">
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

      <CustomDialog
        dialogOpen={ticketCreateDialogOpen}
        toggleDialogOpen={setTicketCreateDialogOpen}
        header="Support"
        withFooter={true}
        showFooterSeparator={false}
        footerBtnLabel="Submit"
        footerBtnAction={handleSubmit(handleTicketCreation)}
        closeOnSubmit={false}
        isSubmitting={ticketCreateMutation.isPending}
        closeAction={() => {
          reset();
          setTicketCreateDialogOpen(false);
          setTicketAreaSearchTerm("");
        }}
      >
        <div className="min-w-125 flex flex-col gap-6 px-5 py-6">
          <div className="input-non-oriented flex-col gap-2">
            <label className="input-label"> {"Area"} </label>
            <CustomCombobox
              items={config.support_ticket_areas}
              getItemLabel={(ticketConfig) => ticketConfig?.label}
              getItemId={(ticketConfig) => ticketConfig?.id}
              filterFn={(item, query) => {
                return Object.values(item).some((val) =>
                  val
                    .toString()
                    .toLocaleLowerCase()
                    .includes(query.toString().toLocaleLowerCase()),
                );
              }}
              onValueChange={(item) => {
                if (item) {
                  setTicketAreaSearchTerm(item.label);
                  setValue("support_ticket_area_id", item.id);
                  clearErrors("support_ticket_area_id");
                }
              }}
              inptFieldValue={ticketAreaSearchTerm}
              inptFieldChange={setTicketAreaSearchTerm}
              className={cn(
                `input-field ${errors.support_ticket_area_id ? `input-error!` : ``}`,
              )}
              placeholder="Select Support area"
            />
            {errors.support_ticket_area_id && (
              <p className="error-text">
                {" "}
                {errors.support_ticket_area_id.message}{" "}
              </p>
            )}
          </div>

          <CustomInput
            control={control}
            name="other_area"
            fieldName="Be Specific"
            placeholder="Enter email"
          />

          <CustomInput
            control={control}
            name="description"
            fieldName="Description"
            inptType="textarea"
            placeholder="Enter support description"
          />
        </div>
      </CustomDialog>

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
            <span className="text-placeholder-text text-sm">
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
