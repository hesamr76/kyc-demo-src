import { ChangeEvent, useState } from "react";

type ImageCaptureType = {
  code: string;
  setImageFile: (image: File) => void;
};

export const ImageCapture = ({ code, setImageFile }: ImageCaptureType) => {
  const [photoData, setPhotoData] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const file = event.target.files[0];

    if (file && file.type.includes("image")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <div className="input-holder">
        <label dir="rtl">
          عکس کارت ملی{" "}
          {code && (
            <span dir="ltr">
              (
              {code
                .split("")
                .map((_, index) => {
                  if (index > 2 && index < 6) {
                    return "*";
                  }
                  return _;
                })
                .join("")}
              )
            </span>
          )}
        </label>
        <input
          className="image-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleInputChange}
        />
      </div>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      {photoData && <img src={photoData} />}
    </div>
  );
};
