import { useState } from "react";

import Lottie from "lottie-react";

import faceLoading from "../assets/animations/face-loading.json";
import { useAxios } from "../hooks/useAxios";
import toast from "react-simple-toasts";
import { Instructions, ResponseType } from "../types";
import { translate } from "../utils";
import { ImageCapture } from "./ImageCapture";
import { VideoRecorder } from "./VideoRecorder";

type RecorderType = {
  code: string;
  instructions?: Instructions;
  setResponse: (response: ResponseType | null) => void;
  publicKey: string;
};

export const Recorder = ({
  code,
  instructions,
  setResponse,
  publicKey,
}: RecorderType) => {
  const [imageFile, setImageFile] = useState<File>();

  const [chunks, setChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const { isLoading, mutate, uploadPercentage } = useAxios("/face");

  const handleUpload = () => {
    const VideoBlob = new Blob(chunks, { type: "video/mp4" });

    const formData = new FormData();
    formData.append("video", VideoBlob, "recorded-video.mp4");
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("national_code", code);
    formData.append("publicKey", publicKey);

    mutate(formData, {
      onSuccess: (response) => {
        setResponse(response?.data);

        toast(response.data.msg, {
          className: response.data.code === "20" ? "toast-success" : "",
          duration: 20000,
        });
      },
    });
  };

  return instructions ? (
    <div>
      <ImageCapture code={code} setImageFile={setImageFile} />
      {Boolean(imageFile) && instructions && (
        <div>
          <p dir="rtl">
            ابتدا دکمه ضبط ویدیو را زده و پس از شروع ضبط، به ترتیبی که در زیر
            آمده است سر خود را حرکت دهید.
          </p>

          <h5>{translate(instructions)}</h5>
        </div>
      )}

      <VideoRecorder
        disabled={isLoading || !Boolean(imageFile)}
        chunks={chunks}
        setChunks={setChunks}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />

      {Boolean(imageFile) && !!chunks.length && !isRecording && (
        <button
          onClick={handleUpload}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          ارسال ویدیو و عکس
        </button>
      )}

      {isLoading &&
        (uploadPercentage < 100 ? (
          <p>%در حال بارگذاری: {uploadPercentage}</p>
        ) : (
          <>
            <p>زمان تقریبی انتظار: ۵دقیقه</p>
            <Lottie
              animationData={faceLoading}
              loop={true}
              className={"face-loading"}
              style={{ width: uploadPercentage }}
            />
          </>
        ))}
    </div>
  ) : null;
};
