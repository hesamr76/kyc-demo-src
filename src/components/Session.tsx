import { useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { Instructions } from "../types";

type SessionPropsType = {
  instructions?: Instructions;
  setInstructions: (instructions?: Instructions) => void;
};
export const Session = ({
  instructions,
  setInstructions,
}: SessionPropsType) => {
  const [code, setCode] = useState("");
  const { isLoading, mutate } = useAxios("session");

  const getSession = async () => {
    const formData = new FormData();
    formData.append("national_code", code);

    mutate(formData, {
      onSuccess: (response) => {
        setInstructions(response.data.instruction);
      },
    });
  };

  return (
    <>
      {!instructions && (
        <>
          {isLoading}
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

      <button
        disabled={code.length !== 10}
        style={{ opacity: code.length === 10 ? 1 : 0.5 }}
        onClick={() => (instructions ? setInstructions() : getSession())}
      >
        مرحله {!instructions ? "بعد" : "قبل"}
      </button>
    </>
  );
};
