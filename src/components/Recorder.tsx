import React, { ChangeEvent, useRef, useState } from "react";

import Lottie from "lottie-react";
import faceArea from "../assets/animations/face-area.json";
import faceLoading from "../assets/animations/face-loading.json";
import { useAxios } from "../hooks/useAxios";
import toast from "react-simple-toasts";
import { Instructions } from "../types";
import { translate } from "../utils";

const VIDEO_TIME = 7000;
let interval: NodeJS.Timer;
let timeout: NodeJS.Timeout;

export const VideoRecorder = ({
  instructions,
}: {
  instructions?: Instructions;
}) => {
  const videoRef = useRef<{ srcObject: MediaStream | null }>({
    srcObject: null,
  });
  const mediaRecorderRef = useRef<MediaRecorder>();
  const [chunks, setChunks] = useState<Blob[]>([]);

  const [photoData, setPhotoData] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File>();
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 512, height: 512, facingMode: "user" },
        audio: false,
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
        mediaRecorderRef.current.start();

        setIsRecording(true);
        stopRecordingTimer();
        [interval, timeout] = startRecordingTimer();
      })
      .catch((error) => {
        console.error("Error accessing user media:", error);
      });
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    stopRecordingTimer();

    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    }

    videoRef.current.srcObject = null;
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      setChunks([event.data]);
    }
  };

  const { isLoading, mutate, uploadPercentage } = useAxios("face");
  const uploadBlob = async (VideoResizedBlob: Blob) => {
    const formData = new FormData();
    formData.append("video", VideoResizedBlob, "recorded-video.mp4");
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("national_code", "0021219958");

    mutate(formData, {
      onSuccess: (response) => {
        toast(response.data.msg, {
          className: response.data.code === 20 ? "toast-success" : "",
        });
      },
    });
  };

  const handleUploadVideo = () => {
    const blob = new Blob(chunks, { type: "video/mp4" });
    uploadBlob(blob);
  };

  const startRecordingTimer = () => {
    const timerInterval = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);

    const timerTimeout = setTimeout(() => {
      handleStopRecording();
    }, VIDEO_TIME);

    return [timerInterval, timerTimeout];
  };

  const stopRecordingTimer = () => {
    clearInterval(interval);
    clearTimeout(timeout);
    setRecordingTime(0);
  };

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

  return !instructions ? (
    <></>
  ) : (
    <div>
      <div>
        {photoData ? (
          <div>
            <img src={photoData} alt="Captured Photo" />
          </div>
        ) : (
          <div className="input-holder">
            <label>عکس کارت ملی</label>
            <input
              className="image-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>

      {photoData && instructions && (
        <p>
          ابتدا دکمه ضبط ویدیو را زده و پس از شروع ضبط، به ترتیبی که در زیر آمده
          است سر خود را حرکت دهید.
        </p>
      )}
      {photoData && instructions && <h5>{translate(instructions)}</h5>}

      <div className="video">
        {isRecording && (
          <Lottie animationData={faceArea} loop={true} className="video-face" />
        )}
        <video
          ref={videoRef as React.LegacyRef<HTMLVideoElement>}
          autoPlay
          muted
        />
      </div>

      {isRecording && recordingTime > 0 && (
        <p>زمان ویدیو: {recordingTime} ثانیه</p>
      )}

      {!isRecording && photoData && !isLoading && (
        <button onClick={handleStartRecording}>
          ضبط ویدیو {!!chunks.length ? "دیگر" : ""}
        </button>
      )}

      {isRecording && <button onClick={handleStopRecording}>توقف</button>}

      {photoData && !!chunks.length && !isRecording && (
        <button
          onClick={handleUploadVideo}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.5 : 1 }}
        >
          ارسال ویدیو و عکس
        </button>
      )}

      {isLoading && uploadPercentage && uploadPercentage < 100 && (
        <p>%در حال بارگذاری: {uploadPercentage}</p>
      )}

      {isLoading && uploadPercentage == 100 && (
        <>
          <p>زمان تقریبی انتظار: ۵دقیقه</p>
          <Lottie
            animationData={faceLoading}
            loop={true}
            className={"face-loading"}
            style={{ width: uploadPercentage }}
          />
        </>
      )}
    </div>
  );
};
