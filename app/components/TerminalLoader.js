"use client";

import { useState, useEffect } from "react";
import { getLoadingSteps, t } from "../translations";

export default function TerminalLoader({ onDone, loadingTime, lang }) {
  const [lines, setLines] = useState([]);
  const [apiDone, setApiDone] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timers = [];
    const steps = getLoadingSteps(lang);
    steps.forEach(({ text, color, delay }) => {
      timers.push(setTimeout(() => setLines(p => [...p, { text, color }]), delay));
    });
    timers.push(setTimeout(() => setMinTimePassed(true), 3800));
    return () => timers.forEach(clearTimeout);
  }, [lang]);

  useEffect(() => {
    if (loadingTime === "done") setApiDone(true);
  }, [loadingTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (apiDone && minTimePassed) onDone();
  }, [apiDone, minTimePassed, onDone]);

  return (
    <div
      role="status"
      aria-label="Analyzing repository"
      style={{
        width: "100%", maxWidth: 540,
        background: "#0a0a0a",
        border: "1px solid rgba(255,30,60,0.2)",
        borderRadius: 14, padding: "20px 24px",
        fontFamily: "'Space Mono', monospace",
        boxShadow: "0 0 60px rgba(255,30,60,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, marginBottom: 18, padding: "12px 14px",
        borderRadius: 12, background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,30,60,0.12)",
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
            color: "#ff1e3c", marginBottom: 5,
          }}>
            {t(lang, "pleaseWait")}
          </div>
          <div style={{
            fontSize: 13, color: "rgba(255,255,255,0.68)", lineHeight: 1.45,
          }}>
            {t(lang, "liveResultsLoading")}
          </div>
        </div>
        <div style={{
          minWidth: 74, textAlign: "center", padding: "8px 12px",
          borderRadius: 999, background: "rgba(255,30,60,0.12)",
          border: "1px solid rgba(255,30,60,0.22)", color: "#ff1e3c",
        }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, lineHeight: 1 }}>
            {elapsedSeconds}s
          </div>
        </div>
      </div>

      <div aria-hidden="true" style={{ display: "flex", gap: 7, marginBottom: 18 }}>
        {["#ff5f57", "#febc2e", "#28c840"].map(c => (
          <div key={c} style={{
            width: 13, height: 13, borderRadius: "50%",
            background: c, boxShadow: `0 0 6px ${c}55`,
          }} />
        ))}
        <span style={{ marginLeft: 8, fontSize: 10, color: "rgba(255,255,255,0.2)", alignSelf: "center" }}>
          reporoast — bash
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 120 }}>
        {lines.map((l, i) => (
          <div key={i} className="terminal-line" style={{ animationDelay: `${i * 0.05}s`, color: l.color, fontSize: 13 }}>
            {l.text}
          </div>
        ))}
        {(!apiDone || !minTimePassed) && (
          <span aria-hidden="true" style={{ color: "#ff1e3c", animation: "blink 1s infinite", fontSize: 16, marginTop: 4 }}>
            █
          </span>
        )}
      </div>
    </div>
  );
}
