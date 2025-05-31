import { useCallback } from "react";

function useSaveToLocalStorage(key) {
  const saveValue = useCallback(
    (value) => {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error("error", error);
      }
    },
    [key]
  );

  return saveValue;
}

export default useSaveToLocalStorage;
