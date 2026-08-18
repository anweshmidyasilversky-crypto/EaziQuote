import { PlusIcon } from "lucide-react";

export type ImageInputProps = {
  imgFile: File | undefined;
  setImgFile: (...event: any[]) => void;
  alt: string;
  altClass?: string;
  altText?: string;
  alignAltImg?: "center" | "end";
};

export function ImageInput({
  imgFile,
  setImgFile,
  alt,
  altClass,
  altText,
  alignAltImg,
}: ImageInputProps) {
  return (
    <div className="flex justify-center">
      <label
        htmlFor="avatar-upload"
        className="cursor-pointer group relative block w-fit"
      >
        {/* Hidden File Input */}

        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] as File;
            setImgFile(file);
          }}
          required={true}
        />
        <div className="flex justify-center">
          <div className="flex justify-center">
            <div className="relative h-25 w-25">
              <div
                className={`h-full w-full border-none shadow-none ring-0 ring-offset-0 bg-[#DFE3E8] overflow-hidden rounded-full flex items-${alignAltImg ?? "end"} justify-center`}
              >
                <img
                  src={imgFile ? URL.createObjectURL(imgFile) : alt}
                  className={`${imgFile ? "object-cover object-center h-full w-full" : (altClass ?? "object-contain h-21 w-21 object-bottom")}  border-none outline-none`}
                  alt={altText ?? "User Placeholder"}
                />
              </div>

              <div className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-dark text-white border-2 border-white shadow-lg hover:bg-brand-hover transition-colors">
                <PlusIcon className="h-5 w-5 stroke-2" />
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
}
