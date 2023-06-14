import Lottie from "lottie-react";

import faceSuccessful from "../assets/animations/verification-successful.json";

import { ResponseType } from "../types";

type ResultType = {
  response: ResponseType;
  onBack: () => void;
};

export const Result = ({ response, onBack }: ResultType) => {
  return (
    <div className="result">
      {response?.code === "20" && (
        <Lottie
          animationData={faceSuccessful}
          loop={false}
          className="video-successful"
        />
      )}
      <p style={{ marginTop: "auto" }}>{response?.msg}</p>
      {response?.code !== "20" && (
        <button onClick={onBack} style={{ marginTop: "auto" }}>
          بازگشت به مرحله قبل
        </button>
      )}
    </div>
  );
};
