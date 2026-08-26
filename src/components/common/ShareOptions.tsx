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

export type ShareOptionsProps = {
  isOpen: boolean;
  toggleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  clientEmail: string;
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
}: ShareOptionsProps) {
  const options: sharOptions[] = [
    {
      imgPath: assets.whatsAppIcon,
      name: "WhatsApp",
    },
    {
      imgPath: assets.facebooksIcon,
      name: "Facebook",
    },
    {
      imgPath: assets.twitterIcon,
      name: "X",
    },
    {
      imgPath: assets.gmailIcon,
      name: "Gmail",
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
            <CarouselContent className="ml-0 gap-3">
              {options.concat(options).map((option, index) => (
                <CarouselItem
                  key={`${option.name}-${index}`}
                  className="basis-auto pl-4"
                >
                  <button
                    type="button"
                    onClick={option.onClick}
                    className="flex w-14 flex-col items-center gap-1.5"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
                      <img
                        src={option.imgPath}
                        alt={option.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <span className="w-full truncate text-center text-xs text-black-text">
                      {option.name}
                    </span>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious
              className="
                absolute -left-4.5 -top-1
                h-7 w-7
                translate-y-0
                rounded-full
                border-none
                bg-[#89909D]
                shadow-sm
                hover:bg-gray-300
                disabled:hidden
                "
            />

            <CarouselNext
              className="
                absolute -right-4.5 -top-1
                h-7 w-7
                translate-y-0
                rounded-full
                border-none
                bg-[#89909D]
                shadow-sm
                hover:bg-gray-300
                disabled:hidden
                "
            />
          </Carousel>

          <div className="min-h-13 rounded-[7px] py-3 px-2 flex gap-3 border border-searchbox-border justify-between items-center">
            <span className="text-base"> {clientEmail} </span>
            <CustomBtn buttonLabel="Send Email" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
