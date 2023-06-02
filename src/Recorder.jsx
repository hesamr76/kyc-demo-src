import React, { useRef, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import faceArea from "./face-area.json";

export const VideoRecorder = ({ instruction }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [imageFile, setImageFile] = useState();
  const [uploadPercentage, setPercentage] = useState();

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { mimeType: "video/mp4" }, audio: false })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );
        mediaRecorderRef.current.start();

        setIsRecording(true);
        stopRecordingTimer();
        startRecordingTimer();
      })
      .catch((error) => {
        console.error("Error accessing user media:", error);
      });
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
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

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };

  const uploadBlob = async (VideoResizedBlob) => {
    const formData = new FormData();
    formData.append("video", VideoResizedBlob, "recorded-video.mp4");

    formData.append("image", imageFile);
    formData.append("national_code", "0021219958");

    axios
      .post("http://localhost:5001/face", formData, {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log("Upload progress:", percentage);
          setPercentage(percentage);
        },
      })
      .then((response) => {
        alert("Video uploaded successfully: " + response.data.msg);
        console.log("Video uploaded successfully:", response.data);
        // Handle the successful upload here
      })
      .catch((error) => {
        console.error("Error uploading video:", error);
        // Handle any errors during the upload process
      });
  };

  const handleUploadVideo = () => {
    const blob = new Blob(chunksRef.current, { type: "video/mp4" });

    // Resize the video using canvas
    const videoElement = document.createElement("video");
    const videoUrl = URL.createObjectURL(blob);
    videoElement.src = videoUrl;

    videoElement.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;
      const aspectRatio = videoWidth / videoHeight;

      const maxWidth = 640; // Set the desired maximum width for the resized video
      const maxHeight = maxWidth / aspectRatio;

      canvas.width = maxWidth;
      canvas.height = maxHeight;

      // Draw the video frame onto the canvas
      context.drawImage(videoElement, 0, 0, maxWidth, maxHeight);

      // Convert the canvas content to a data URL
      const resizedDataUrl = canvas.toDataURL("video/mp4", 0.5); // Adjust the quality if needed (0.5 represents 50% quality)

      // Convert the data URL back to a Blob
      const byteString = atob(resizedDataUrl.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const resizedBlob = new Blob([ab], { type: "video/mp4" });

      uploadBlob(resizedBlob);
      URL.revokeObjectURL(videoUrl);
    };
  };

  const startRecordingTimer = () => {
    const timerInterval = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);

    setTimeout(() => {
      handleStopRecording();
    }, 10000);

    return timerInterval;
  };

  const stopRecordingTimer = () => {
    setRecordingTime(0);
  };

  const [photoData, setPhotoData] = useState(null);

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.includes("image")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const translate = (instruction) => {
    return instruction
      .map((instru, index) => {
        switch (instru) {
          case "forward":
            return "روبه‌رو";
          case "right":
            return "راست";
          case "left":
            return "چپ";
          case "down":
            return "پایین";
          case "up":
            return "بالا";

          default:
            return "روبه‌رو";
        }
      })
      .join(" >  ");
  };
  return !instruction ? (
    <></>
  ) : (
    <div>
      <div>
        {photoData ? (
          <div>
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
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

      {photoData && instruction && (
        <p>
          ابتدا دکمه ضبط ویدیو را زده و پس از شروع ضبط، به ترتیبی که در زیر آمده
          است سر خود را حرکت دهید.
        </p>
      )}
      {photoData && instruction && <h5>{translate(instruction)}</h5>}

      <div className="video">
        {isRecording && (
          <Lottie animationData={faceArea} loop={true} className="video-face" />
        )}
        <video ref={videoRef} autoPlay muted />
      </div>
      {isRecording && recordingTime > 0 && (
        <p>زمان ویدیو: {recordingTime} ثانیه</p>
      )}

      {!isRecording && photoData && (
        <button onClick={handleStartRecording}>
          ضبط ویدیو {!!chunksRef.current.length ? "دیگر" : ""}
        </button>
      )}
      {isRecording && <button onClick={handleStopRecording}>توقف</button>}
      {photoData && !!chunksRef.current.length && !isRecording && (
        <button onClick={handleUploadVideo}>ارسال ویدیو و عکس</button>
      )}
      {photoData &&
        !!chunksRef.current.length &&
        !isRecording &&
        uploadPercentage && <p>%در حال بارگذاری: {uploadPercentage}</p>}
    </div>
  );
};
