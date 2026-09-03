import { assets } from "@/assets/icons";
import {
  CustomHeader,
  type CustomHeaderProps,
} from "@/components/common/CustomHeader";
import type { SettingsCardProps } from "@/components/settings/SettingsCard";
import SettingsCard from "@/components/settings/SettingsCard";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import StripeAdvisoryDialog, {
  type StripeAdvisoryDialogProps,
} from "./StripeAdvisoryDialog";
import { useNavigate } from "react-router";

function SettingsIndexPage() {
  const navigate = useNavigate();
  const [stripeDialogOpen, toggleStripeDialogOpen] = useState(false);

  {
    /* For dummy purpose state to toggle between connect and connected state for stripe */
  }
  const [isStripConnected, toggleStripConnected] = useState(false);

  const stripAdvisoryType =
    useRef<StripeAdvisoryDialogProps["type"]>("connect");

  const headerBtnConfigList: CustomHeaderProps["btnConfigList"] = [
    {
      buttonLabel: "Subscribe",
      leftIcon: assets.subscriptionIconWhite,
      btncls: cn(`bg-subscription-gradient min-h-9 max-w-29.25`),
    },
  ];

  const settingsCards: SettingsCardProps[] = [
    {
      icon: assets.userIconBlue,
      title: "Profile",
      titleDesc:
        "Manage your company profile, including name, contact info, and logo.",
    },
    {
      icon: assets.subscriptionIconBlue,
      title: "Subscription & Billing",
      titleDesc: "Manage your plan, payments, and billing records",
      onClick: () => navigate("/settings/subscription"),
    },
    {
      icon: assets.paymentIconBlue,
      title: "Payments & Invoicing",
      titleDesc:
        "Configure payment details, billing preferences, and quote/invoice settings.",
      titleRightIcon: assets.infoIcon,
      rightIconAction: () => {
        stripAdvisoryType.current = "advisory";
        toggleStripeDialogOpen((curr) => !curr);
      },
    },
    {
      icon: assets.rectangleBlue,
      title: "Connect Stripe",
      titleDesc: "Set up Stripe to start accepting payments from your clients.",
      btnConfig: {
        buttonLabel: isStripConnected ? "Connected" : "Connect",
        disabled: isStripConnected,
        btncls: cn(
          isStripConnected
            ? `bg-transparent-ming-green text-ming-green hover:bg-transparent-ming-green`
            : ``,
        ),
        onClick: () => {
          stripAdvisoryType.current = "connect";
          toggleStripeDialogOpen((curr) => !curr);
        },
      },
    },
    {
      icon: assets.groupUserIconBlue,
      title: "Team Members",
      titleDesc:
        "Add or manage staff accounts and set their roles or access permissions.",
    },
    {
      icon: assets.sectionsIconBlue,
      title: "Sections",
      titleDesc:
        "Save and manage reusable text blocks for quick insertion into your quotes and invoices.",
    },
    {
      icon: assets.categoryIconBlue,
      title: "Categories",
      titleDesc:
        "Organize your work by defining main categories for materials, labor, or services.",
    },
    {
      icon: assets.subCategoryIconBlue,
      title: "Sub-categories",
      titleDesc:
        "Create sub-level groupings under categories for more precise organization.",
    },
    {
      icon: assets.itemsIconBlue,
      title: "Items",
      titleDesc:
        "Add and manage individual items or services that appear in quotes and invoices.",
    },
    {
      icon: assets.notificationIconBlue,
      title: "Notifications Preference",
      titleDesc:
        "Choose when and how you receive alerts about quotes, invoices, and jobs.",
    },
    {
      icon: assets.videoTutorialIconBlue,
      title: "Video Tutorials",
      titleDesc:
        "Watch quick guides and walkthroughs to help you get the most out of EasyQuotes.",
    },
    {
      icon: assets.changepasswordIconBlue,
      title: "Change Password",
      titleDesc: "Update your account password to keep your profile secure.",
    },
  ];

  return (
    <>
      <div className="p-6 flex flex-col gap-4">
        <CustomHeader
          header="Settings"
          headerInfo="Personalise your workspace and tools"
          btnConfigList={headerBtnConfigList}
        />

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {settingsCards.map((settingsCardConfig) => (
            <SettingsCard
              cardCls={cn(`min-h-22.75`)}
              key={settingsCardConfig.title}
              {...settingsCardConfig}
            />
          ))}
        </div>
      </div>

      <StripeAdvisoryDialog
        isOpen={stripeDialogOpen}
        toggleIsOpen={toggleStripeDialogOpen}
        type={stripAdvisoryType.current}
        action={
          stripAdvisoryType.current === "connect"
            ? () => toggleStripConnected((curr) => !curr)
            : undefined
        }
      />
    </>
  );
}

export default SettingsIndexPage;
