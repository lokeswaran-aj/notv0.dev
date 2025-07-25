import { useEffect, useState } from "react";

const INITIAL_MESSAGE_KEY = "initial-message";

export function useInitialMessage() {
  const [initialMessage, setInitialMessageState] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(INITIAL_MESSAGE_KEY);
      if (stored) {
        setInitialMessageState(stored);
      }
    }
  }, []);

  const setInitialMessage = (message: string) => {
    setInitialMessageState(message);
    if (typeof window !== "undefined") {
      if (message.trim()) {
        localStorage.setItem(INITIAL_MESSAGE_KEY, message);
      } else {
        localStorage.removeItem(INITIAL_MESSAGE_KEY);
      }
    }
  };

  const getStoredMessage = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(INITIAL_MESSAGE_KEY);
    }
    return null;
  };

  const clearInitialMessage = () => {
    setInitialMessageState("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(INITIAL_MESSAGE_KEY);
    }
  };

  return {
    initialMessage,
    setInitialMessage,
    getStoredMessage,
    clearInitialMessage,
  };
}
