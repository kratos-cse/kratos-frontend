"use client";

import { useState } from "react";

export default function RegistrationsPanel({ open }) {
  const [copied, setCopied] = useState(false);
  const inviteUrl = "kratos26.ace.club/join/football-7f2a";

  function copyInvite() {
    if (navigator.clipboard) navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section id="registrations">
      <div className="container">
        <div className={`profile-panel${open ? " open" : ""}`} id="profilePanel">
          <h2 className="profile-title">My Profile</h2>
          <div className="profile-head">
            <div className="avatar">R</div>
            <div>
              <h3 className="profile-tab">Registered Events</h3>
              <small>Signed in via Google — roster data from backend.</small>
            </div>
          </div>
          <div className="roster">
            <div className="roster-head">
              <b>Football — 7-a-side</b>
              <span className="roster-sub">4 of 7 filled · 2 subs needed</span>
            </div>
            <div className="roster-bar">
              <span style={{ width: "57%" }} />
            </div>
            <ul className="roster-list">
              <li>
                <span>Arjun R. (Captain)</span>
                <span>Confirmed</span>
              </li>
              <li>
                <span>Vikram S.</span>
                <span>Confirmed</span>
              </li>
              <li>
                <span>Naveen K.</span>
                <span>Confirmed</span>
              </li>
              <li>
                <span>Deepak M.</span>
                <span>Confirmed</span>
              </li>
              <li className="empty">
                <span>Open slot</span>
                <span>Invite pending</span>
              </li>
              <li className="empty">
                <span>Open slot</span>
                <span>Invite pending</span>
              </li>
              <li className="empty">
                <span>Substitute slot</span>
                <span>Invite pending</span>
              </li>
            </ul>
            <div className="invite-row">
              <input type="text" readOnly value={inviteUrl} />
              <button type="button" id="copyInviteBtn" onClick={copyInvite}>
                {copied ? "Copied!" : "Copy invite link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
