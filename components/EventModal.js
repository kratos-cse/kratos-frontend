"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useModal } from "@/context/ModalContext";
import StatusBanner from "@/components/kratos/ui/StatusBanner";
import useUserRegistrations from "@/hooks/useUserRegistrations";
import { useAuth } from "@/context/AuthProvider";

export default function EventModal() {
  const { event, closeModal, regMode, setRegMode } = useModal();
  const { isAuthenticated } = useAuth();
  const { getStatus } = useUserRegistrations();
  const registrationStatus = event ? getStatus(event.id) : null;

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
            {registrationStatus === "confirmed" && (
              <>
                <StatusBanner tone="ok" title="Registered">
                  You are already registered for this event. Check your dashboard for details.
                </StatusBanner>
                <Link href="/dashboard" className="btn btn-ghost">
                  View My Registrations
                </Link>
              </>
            )}
            {registrationStatus === "failed" && (
              <>
                <StatusBanner tone="err" title="Payment Failed">
                  Your previous payment was not successful. Please try again.
                </StatusBanner>
                <button type="button" className="btn btn-primary">
                  Retry Payment
                </button>
              </>
            )}
            {registrationStatus === "pending" && (
              <>
                <StatusBanner tone="warn" title="Payment Pending">
                  Your payment is being processed. If not confirmed within 15 minutes, you can retry.
                </StatusBanner>
                <button type="button" className="btn btn-ghost">
                  Retry Payment
                </button>
              </>
            )}
            {!registrationStatus && (
              <>
                {!isAuthenticated && <p className="form-note">Sign in to register.</p>}
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
          </>
        )}
      </div>
    </div>
  );
}
