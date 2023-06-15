import Lottie from "lottie-react";

import faceSuccessful from "../assets/animations/verification-successful.json";
import faceFail from "../assets/animations/verification-fail.json";

import { ResponseType } from "../types";

type ResultType = {
  response: ResponseType;
  onBack: () => void;
};

export const Result = ({ response, onBack }: ResultType) => {
  return (
    <div className="result">
      <Lottie
        animationData={response?.code === "20" ? faceSuccessful : faceFail}
        loop={false}
        className="verification"
      />

      <p style={{ marginTop: "auto" }}>{response?.msg}</p>
      {response?.code !== "20" && (
        <button onClick={onBack} style={{ marginTop: "auto" }}>
          بازگشت به مرحله قبل
        </button>
      )}
    </div>
  );
};
