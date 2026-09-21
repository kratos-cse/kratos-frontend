"use client";

import { useEffect } from "react";
import { useModal } from "@/context/ModalContext";

export default function EventModal() {
  const { event, closeModal, regMode, setRegMode } = useModal();

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeModal]);

  return (
    <div
      className={`modal-overlay${event ? " open" : ""}`}
      id="modalOverlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className="modal" id="modalBody">
        {event && (
          <>
            <button className="modal-close" id="modalClose" onClick={closeModal}>
              ✕
            </button>
            <span className="mtag">{event.track}</span>
            <h3>{event.name}</h3>
            <div className="mrow">
              <div>
                <b>Timing</b>
                {event.time}
              </div>
              <div>
                <b>Venue</b>
                {event.venue}
              </div>
              <div>
                <b>Team</b>
                {event.team}
              </div>
              <div>
                <b>Fee</b>
                {event.fee}
              </div>
            </div>
            <p className="desc">{event.desc}</p>
            <ul className="rules">
              {event.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            {event.roster && (
              <div className="roster">
                <div className="roster-head">
                  <b>{event.name} roster</b>
                  <span className="roster-sub">
                    {event.filled} of {event.total} filled · {event.subs} sub(s)
                  </span>
                </div>
                <div className="roster-bar">
                  <span style={{ width: `${Math.round((event.filled / event.total) * 100)}%` }} />
                </div>
                <p className="form-note">Roster populated by backend.</p>
              </div>
            )}
            <div className="reg-toggle">
              <button
                type="button"
                className={regMode === "leader" ? "active" : ""}
                onClick={() => setRegMode("leader")}
              >
                Register as leader
              </button>
              <button
                type="button"
                className={regMode === "invite" ? "active" : ""}
                onClick={() => setRegMode("invite")}
              >
                Join with invite link
              </button>
            </div>
            <div className="pay-row">
              <div>
                <b>{event.fee}</b>
                <div style={{ fontSize: ".76rem", color: "var(--ash-dim)" }}>Via Razorpay</div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: "11px 22px", fontSize: ".78rem" }}
                id="payBtn"
                onClick={() => alert("Razorpay endpoint not live yet.")}
              >
                Register & Pay
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
