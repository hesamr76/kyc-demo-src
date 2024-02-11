import { useState } from "react";
import Lottie from "lottie-react";

import "./assets/styles/App.css";
import { Instructions, ResponseType } from "./types";
import faceArea from "./assets/animations/face-animation.json";

import { Recorder } from "./components/Recorder";
import { Session } from "./components/Session";
import { Result } from "./components/Result";

function App() {
  const [code, setCode] = useState("");
  const [instructions, setInstructions] = useState<Instructions | undefined>();
  const [response, setResponse] = useState<ResponseType | null>(null);

  const queryParameters = new URLSearchParams(window.location.search);
  const publicKey = queryParameters.get("key") || "";

  return (
    <div className="App">
      <header className="App-header">
        {window.opener && (
          <button
            onClick={() => {
              window.opener?.postMessage(
                { validationToken: "your_validation_token" },
                "*"
              );
              window.close();
            }}
          >
            بازگشت به سایت پذیرنده
          </button>
        )}
        {!instructions && (
          <Lottie
            animationData={faceArea}
            loop={true}
            className={"face-animation"}
          />
        )}

        {response ? (
          <Result
            response={response}
            onBack={() => {
              setResponse(null);
            }}
          />
        ) : (
          <>
            <Session
              code={code}
              setCode={(code) => {
                setCode(code);
              }}
              instructions={instructions}
              setInstructions={(newInstructions) =>
                setInstructions(newInstructions)
              }
              publicKey={publicKey}
            />
            <Recorder
              code={code}
              instructions={instructions}
              setResponse={(response) => {
                setResponse(response);
              }}
              publicKey={publicKey}
            />
          </>
        )}
      </header>
    </div>
  );
}

export default App;
