import { useState } from "react";
import Lottie from "lottie-react";

import "./assets/styles/App.css";
import faceArea from "./assets/animations/face-animation.json";

import { VideoRecorder } from "./components/Recorder";
import { Session } from "./components/Session";
import { Instructions } from "./types";

function App() {
  const [instructions, setInstructions] = useState<Instructions>();

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
          instructions={instructions}
          setInstructions={(newInstructions) =>
            setInstructions(newInstructions)
          }
        />
        <VideoRecorder instructions={instructions} />
      </header>
    </div>
  );
}

export default App;
