import { useState } from "react";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { ImageInput } from "../../components/auth/imageInput";
import { assets } from "../../assets/icons";

export function BusinessProfileForm() {
  const [logo, setLogo] = useState<File | undefined>(undefined);
  return (
    <div className="flex justify-center g-8 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Business Profile Setup</CardTitle>
        </CardHeader>

        <div className="flex flex-col">
          <ImageInput
            imgFile={logo}
            setImgFile={setLogo}
            alt={assets.cameraIcon}
          />
          <p className="text-[14px] font-normal text-center">
            {" "}
            Your logo will appear on quotes, invoices, and client emails.{" "}
          </p>

          <input type="color" onChange={(e) => console.log(e.target.value)} />
        </div>
      </Card>
    </div>
  );
}
