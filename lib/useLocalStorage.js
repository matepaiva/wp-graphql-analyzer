/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import isServer from "./isServer";
import { noop } from "lodash";

export function getItem(key) {
  if (isServer) return null;

  const value = localStorage.getItem(key);

  return value ? JSON.parse(value) : null;
}

export default function useLocalStorage(key, onClick = noop) {
  const [state, setState] = useState(getItem(key));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  const storageWatcher = useCallback(() => {
    const value = localStorage.getItem(key);
    const jsonValue = JSON.parse(value ?? null);
    if (jsonValue !== state) {
      setState(jsonValue);

      // Everytime the value changes, the callback is triggered with the new value
      onClick(value);
    }
  }, [state]);

  useEffect(() => {
    window.addEventListener("storage", storageWatcher);
    return () => {
      window.removeEventListener("storage", storageWatcher);
    };
  }, [state]);

  return [state, setState];
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  dispatchEvent(new Event("storage"));
}
