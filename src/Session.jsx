import React, { useState } from "react";

import axios from "axios";

export const Session = ({ instruction, setInstruction }) => {
  const [code, setCode] = useState();

  const getSession = async () => {
    const formData = new FormData();
    formData.append("national_code", code);

    const response = await axios.post(
      "http://localhost:5001/session",
      formData
    );

    setInstruction(response.data.instruction);
  };

  return (
    <>
      {!instruction && (
        <>
          {" "}
          <div className="input-holder">
            <label>شماره موبایل</label>
            <input type="tel" name="mobile" />
          </div>
          <div className="input-holder">
            <label>کد ملی</label>
            <input
              type="text"
              name="national_code"
              value={code}
              maxLength={10}
              minLength={10}
              onChange={(event) => setCode(event.target.value)}
            />
          </div>
        </>
      )}

      <button onClick={getSession}>مرحله {!instruction ? "بعد" : "قبل"}</button>
    </>
  );
};
