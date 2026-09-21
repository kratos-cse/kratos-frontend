"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-03-20T09:00:00+05:30");

function getParts() {
  let d = Math.max(0, TARGET - new Date());
  const dd = Math.floor(d / 864e5);
  d -= dd * 864e5;
  const hh = Math.floor(d / 36e5);
  d -= hh * 36e5;
  const mm = Math.floor(d / 6e4);
  d -= mm * 6e4;
  const ss = Math.floor(d / 1e3);
  return {
    day: String(dd).padStart(2, "0"),
    hour: String(hh).padStart(2, "0"),
    min: String(mm).padStart(2, "0"),
    sec: String(ss).padStart(2, "0"),
    calDay: TARGET.getDate(),
  };
}

export default function Countdown() {
  const [parts, setParts] = useState({ day: "00", hour: "00", min: "00", sec: "00", calDay: "—" });

  useEffect(() => {
    setParts(getParts());
    const id = setInterval(() => setParts(getParts()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="calendar-row">
      <div className="cal-icon">
        <div className="top" />
        <div className="num" id="calDay">
          {parts.calDay}
        </div>
      </div>
      <div className="countdown">
        <div className="cd">
          <b id="cdD">{parts.day}</b>
          <small>Days</small>
        </div>
        <div className="cd">
          <b id="cdH">{parts.hour}</b>
          <small>Hrs</small>
        </div>
        <div className="cd">
          <b id="cdM">{parts.min}</b>
          <small>Min</small>
        </div>
        <div className="cd">
          <b id="cdS">{parts.sec}</b>
          <small>Sec</small>
        </div>
      </div>
    </div>
  );
}
