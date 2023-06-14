import { LegacyRef, useRef, useState } from "react";

import Lottie from "lottie-react";
import faceArea from "../assets/animations/face-area.json";

const VIDEO_TIME = 7000;
let interval: NodeJS.Timer;
let timeout: NodeJS.Timeout;

type VideoRecorderType = {
  chunks: Blob[];
  setChunks: (chunks: Blob[]) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;

  disabled: boolean;
};

export const VideoRecorder = ({
  disabled,
  chunks,
  setChunks,
  isRecording,
  setIsRecording,
}: VideoRecorderType) => {
  const scrollRef = useRef<HTMLButtonElement>();
  const videoRef = useRef<{ srcObject: MediaStream | null }>({
    srcObject: null,
  });
  const mediaRecorderRef = useRef<MediaRecorder>();

  const [recordingTime, setRecordingTime] = useState(0);

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

  const startRecordingTimer = () => {
    scrollRef.current?.scrollIntoView();

    const timerInterval = setInterval(() => {
      scrollRef.current?.scrollIntoView();
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

  return (
    <div>
      <div>
        <div className="video">
          {isRecording && (
            <Lottie
              animationData={faceArea}
              loop={true}
              className="video-face"
            />
          )}
          <video
            ref={videoRef as React.LegacyRef<HTMLVideoElement>}
            autoPlay
            muted
            height={isRecording ? undefined : 0}
          />
        </div>

        {isRecording && recordingTime > 0 && (
          <p>زمان ویدیو: {recordingTime} ثانیه</p>
        )}
      </div>

      {isRecording ? (
        <button
          ref={scrollRef as LegacyRef<HTMLButtonElement>}
          onClick={handleStopRecording}
        >
          توقف
        </button>
      ) : (
        <button
          onClick={handleStartRecording}
          disabled={disabled}
          style={{ opacity: disabled ? 0.5 : 1 }}
          className={chunks.length ? "outline" : undefined}
        >
          ضبط ویدیو {!!chunks.length ? "دیگر" : ""}
        </button>
      )}
    </div>
  );
};
