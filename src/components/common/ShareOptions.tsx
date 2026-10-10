import { assets } from "../../assets/icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { XIcon } from "lucide-react";
import { CustomBtn } from "./CustomBtn";
import { toast } from "react-toastify";

export type ShareOptionsProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clientEmail: string;
  sendEmailAction?: () => void;
  isEmailSending?: boolean;
  shareLink?: string;
  downloadLink?: string;
  appId?: string | number;
  title?: string;
};

type sharOptions = {
  imgPath: string;
  name: string;
  onClick?: () => void;
};

export function ShareOptions({
  isOpen,
  toggleIsOpen,
  clientEmail,
  sendEmailAction,
  isEmailSending,
  shareLink,
  downloadLink,
  appId,
  title,
}: ShareOptionsProps) {
  const shareMessage = encodeURIComponent(
    `Hi, please find your quote here: View: ${shareLink} Download: ${downloadLink} Thank you.`,
  );
  const options: sharOptions[] = [
    {
      imgPath: assets.whatsAppIcon,
      name: "WhatsApp",
      onClick: () =>
        window.open(`https://wa.me/send?text=${shareMessage}`, "_blank"),
    },
    {
      imgPath: assets.facebooksIcon,
      name: "Facebook",
      onClick: () =>
        window.open(
          `https://www.facebook.com/share_as_message/?link=${downloadLink}&app_id=${appId}`,
          `_blank`,
        ),
    },
    {
      imgPath: assets.gmailIcon,
      name: "Gmail",
      onClick: () =>
        window.open(
          `mailto:?subject=${encodeURIComponent(title ?? "")}&body=${shareMessage}`,
        ),
    },
    {
      imgPath: assets.shareMoreIcon,
      name: "Share",
      onClick: async () => {
        const shareData: ShareData = {
          title: title, // This becomes the subject line if shared via Email/Outlook
          text: shareMessage, // This populates the main text message body
        };
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare(shareData)
        ) {
          try {
            // Trigger the system menu shown in your screenshot
            await navigator.share(shareData);
            console.log("Quote shared successfully!");
          } catch (error) {
            // Handle when a user cancels/closes the share menu manually
            console.log("Share menu closed or failed:", error);
          }
        } else {
          toast.error(`This Browser doesn't support Web Share API`);
        }
      },
    },
  ];
  return (
    <Dialog open={isOpen} onOpenChange={toggleIsOpen}>
      <DialogContent
        className={`ring-0 w-fit! bg-white p-0 min-w-125 flex flex-col`}
        showCloseButton={false}
      >
        <DialogHeader className="bg-table-head rounded-[7px]">
          <div className="flex justify-between p-5">
            <span className="font-medium text-sm"> Share </span>
            <XIcon
              className="text-muted hover:text-black-text"
              onClick={() => toggleIsOpen(false)}
            />
          </div>
        </DialogHeader>
        <div className="flex flex-col gap-6 bg-white p-5 rounded-[7px]">
          <Carousel
            opts={{
              align: "start",
            }}
            className="relative w-full"
          >
            <CarouselContent className="ml-0 gap-2">
              {options.map((option, index) => (
                <CarouselItem
                  key={`${option.name}-${index}`}
                  className="min-w-0 flex-1 basis-0 pl-0"
                >
                  <button
                    type="button"
                    onClick={option.onClick}
                    className="mx-auto flex w-14 max-w-full flex-col items-center gap-1.5 translate-y-0!"
                  >
                    <div className="h-14 w-14 max-w-full shrink-0 overflow-hidden rounded-full hover:shadow-2xl hover:-translate-y-0.2 transform delay-200 transition-all">
                      <img
                        src={option.imgPath}
                        alt={option.name}
                        className="h-full w-full object-contain "
                      />
                    </div>

                    <span className="w-full truncate text-center text-xs text-black-text">
                      {option.name}
                    </span>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute -left-4.5 -top-1 h-7 w-7 translate-y-0 rounded-full border-none bg-placeholder-text shadow-sm hover:bg-gray-300 disabled:hidden" />

            <CarouselNext className="absolute -right-4.5 -top-1 h-7 w-7 translate-y-0 rounded-full border-none bg-placeholder-text shadow-sm hover:bg-gray-300 disabled:hidden" />
          </Carousel>

          <div className="min-h-13 rounded-[7px] py-3 px-2 flex gap-3 border border-searchbox-border justify-between items-center">
            <span className="text-base"> {clientEmail} </span>
            <CustomBtn
              buttonLabel="Send Email"
              onClick={sendEmailAction}
              disabled={isEmailSending}
              isSubmitting={isEmailSending}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
