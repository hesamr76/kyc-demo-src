import { useState } from "react";
import Lottie from "lottie-react";

import "./assets/styles/App.css";
import faceArea from "./assets/animations/face-animation.json";

import { VideoRecorder } from "./components/Recorder";
import { Session } from "./components/Session";
import { Instructions } from "./types";

function App() {
  const [code, setCode] = useState("");
  const [instructions, setInstructions] = useState<Instructions | undefined>();

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
        <VideoRecorder instructions={instructions} code={code} />
      </header>
    </div>
  );
}

export default App;
