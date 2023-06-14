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

  return (
    <div className="App">
      <header className="App-header">
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
            />
            <Recorder
              code={code}
              instructions={instructions}
              setResponse={(response) => {
                setResponse(response);
              }}
            />
          </>
        )}
      </header>
    </div>
  );
}

export default App;
