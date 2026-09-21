"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [event, setEvent] = useState(null);
  const [regMode, setRegMode] = useState("leader");

  const openModal = useCallback((ev) => {
    setRegMode("leader");
    setEvent(ev);
  }, []);

  const closeModal = useCallback(() => setEvent(null), []);

  const value = useMemo(
    () => ({ event, openModal, closeModal, regMode, setRegMode }),
    [event, openModal, closeModal, regMode]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}
