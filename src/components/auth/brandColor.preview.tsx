import { XIcon } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function BrandColorPreview({
  closePreviewFunc,
  chosenColor,
}: {
  closePreviewFunc: () => void;
  chosenColor: string;
}) {
  return (
    <Card className="w-full max-w-125 gap-6 opacity-100 border-none shadow-none bg-white">
      <CardHeader className="flex justify-between p-5">
        <CardTitle>Brand Color</CardTitle>

        <CardAction>
          <XIcon onClick={closePreviewFunc} />
        </CardAction>
      </CardHeader>

      <CardContent className="w-full flex flex-col justify-center px-5 gap-6">
        <p className="w-full max-w-115 faded-text">
          Your brand colour will be used to personalise your quotes, invoices,
          and templates, helping maintain a consistent and professional look
          across your business materials.
        </p>

        <div className="flex flex-col gap-3">
          <p className="inline-block faded-text"> Preview </p>

          <Card className="ring-0 w-full h-full max-w-112.5 max-h-127.25">
            <CardHeader>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={chosenColor}
                  className={`rounded-color-input`}
                  disabled={true}
                />
              </div>
            </CardHeader>

            <CardContent className="w-full max-w-109"></CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
