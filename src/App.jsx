import React, { useState } from "react";
import Lottie from "lottie-react";

import "./App.css";
import faceArea from "./face-animation.json";

import { VideoRecorder } from "./Recorder";
import { Session } from "./Session";

function App() {
  const [instruction, setInstruction] = useState();

  return (
    <div className="App">
      <header className="App-header">
        {!instruction && (
          <Lottie
            animationData={faceArea}
            loop={true}
            className={"face-animation"}
          />
        )}

        <Session instruction={instruction} setInstruction={setInstruction} />
        <VideoRecorder instruction={instruction} />
      </header>
    </div>
  );
}

export default App;
