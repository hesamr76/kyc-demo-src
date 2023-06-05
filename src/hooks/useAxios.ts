import axios, { AxiosResponse, AxiosError } from "axios";
import { useState } from "react";
import toast from "react-simple-toasts";

// const BASE_URL = "http://127.0.0.1:5001/";
const BASE_URL = "https://kyc.irsign.com/";

type OptionsType = {
  onSuccess?: (response: AxiosResponse) => void;
  onError?: (error: AxiosError) => void;
};

export const useAxios = (url: string) => {
  const [isLoading, setLoading] = useState(false);
  const [uploadPercentage, setPercentage] = useState(0);

  const mutate = (body: FormData, options?: OptionsType) => {
    setLoading(true);
    axios
      .post(BASE_URL + url, body, {
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setPercentage(percentage);
        },
      })
      .then((response) => {
        if (options?.onSuccess) {
          options.onSuccess(response);
        }
      })
      .catch((error) => {
        if (options?.onError) {
          options.onError(error);
        } else {
          toast(error.message, {
            className: "toast-error",
            clickClosable: true,
          });
          console.error("Error getting session:", error);
        }
      })
      .finally(() => setLoading(false));
  };
  return { isLoading, uploadPercentage, mutate };
};
