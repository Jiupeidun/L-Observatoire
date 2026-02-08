"use client";

import { useState, useEffect } from "react";
import { FlapDisplay, Presets } from "react-split-flap-effect";
import "react-split-flap-effect/extras/themes.css";

const EXAM_DATE = new Date("2026-04-09T00:00:00");

/** Calcule le temps restant jusqu'à la date d'examen (ou dépassé). */
function getTimeLeft() {
  const now = new Date();
  const diff = EXAM_DATE.getTime() - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    passed: false,
  };
}

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function pad3(n: number) {
  return n.toString().padStart(3, "0");
}

function pad4(n: number) {
  return n.toString().padStart(4, "0");
}

/** Heure actuelle (jour, mois, année, H, min, s). */
function getCurrentTime() {
  const d = new Date();
  return {
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
  };
}

/** Valeurs initiales identiques SSR/client pour éviter le mismatch d'hydratation (aria-label). */
const INITIAL_LEFT = { days: 0, hours: 0, minutes: 0, seconds: 0, passed: false };
const INITIAL_NOW = { day: 1, month: 1, year: 2025, hours: 0, minutes: 0, seconds: 0 };

const flapProps2 = {
  chars: Presets.NUM as string,
  length: 2,
  padMode: "start" as const,
  timing: 25,
  className: "countdownFlapDisplay",
};

const flapProps4 = {
  chars: Presets.NUM as string,
  length: 4,
  padMode: "start" as const,
  timing: 25,
  className: "countdownFlapDisplay",
};

/** Compte à rebours TCF Canada (style tableau d'aéroport). */
export default function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [left, setLeft] = useState(INITIAL_LEFT);
  const [now, setNow] = useState(INITIAL_NOW);

  useEffect(() => {
    setLeft(getTimeLeft());
    setNow(getCurrentTime());
    setMounted(true);
    const t = setInterval(() => {
      setLeft(getTimeLeft());
      setNow(getCurrentTime());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const dateFlaps = (
    <div className="countdownRow countdownFlapRow">
      <FlapDisplay {...flapProps2} value={pad2(now.day)} />
      <span className="countdownSep">/</span>
      <FlapDisplay {...flapProps2} value={pad2(now.month)} />
      <span className="countdownSep">/</span>
      <FlapDisplay {...flapProps4} value={pad4(now.year)} />
    </div>
  );

  const timeFlaps = (
    <div className="countdownRow countdownFlapRow">
      <FlapDisplay {...flapProps2} value={pad2(now.hours)} />
      <span className="countdownSep">:</span>
      <FlapDisplay {...flapProps2} value={pad2(now.minutes)} />
      <span className="countdownSep">:</span>
      <FlapDisplay {...flapProps2} value={pad2(now.seconds)} />
    </div>
  );

  const countdownFlaps = (
    <div className="countdownRow countdownFlapRow">
      <FlapDisplay
        chars={Presets.NUM}
        length={3}
        value={left.passed ? "  0" : pad3(left.days)}
        padMode="start"
        timing={25}
        className="countdownFlapDisplay"
      />
      <span className="countdownSep">J</span>
      <FlapDisplay {...flapProps2} value={pad2(left.hours)} />
      <span className="countdownSep">:</span>
      <FlapDisplay {...flapProps2} value={pad2(left.minutes)} />
      <span className="countdownSep">:</span>
      <FlapDisplay {...flapProps2} value={pad2(left.seconds)} />
    </div>
  );

  if (!mounted) {
    return (
      <div className="countdown countdownFlap light L">
        <div className="countdownGrid">
          <div className="countdownCol">
            <p className="countdownLabel">Heure actuelle</p>
            <div className="countdownRow countdownFlapRow">
              <FlapDisplay {...flapProps2} value="01" />
              <span className="countdownSep">/</span>
              <FlapDisplay {...flapProps2} value="01" />
              <span className="countdownSep">/</span>
              <FlapDisplay {...flapProps4} value="2025" />
            </div>
            <div className="countdownRow countdownFlapRow">
              <FlapDisplay {...flapProps2} value="00" />
              <span className="countdownSep">:</span>
              <FlapDisplay {...flapProps2} value="00" />
              <span className="countdownSep">:</span>
              <FlapDisplay {...flapProps2} value="00" />
            </div>
          </div>
          <div className="countdownCol">
            <p className="countdownLabel">Prochaine épreuve — 9 avril 2026</p>
            {countdownFlaps}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="countdown countdownFlap light L">
      <div className="countdownGrid">
        <div className="countdownCol">
          <p className="countdownLabel">Heure actuelle</p>
          {dateFlaps}
          {timeFlaps}
        </div>
        <div className="countdownCol">
          <p className="countdownLabel">
            {left.passed ? "Épreuve du 9 avril 2026" : "Prochaine épreuve — 9 avril 2026"}
          </p>
          {countdownFlaps}
        </div>
      </div>
    </div>
  );
}
