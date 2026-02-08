"use client";

import { useState, useEffect } from "react";
import { FlapDisplay, Presets } from "react-split-flap-effect";
import "react-split-flap-effect/extras/themes.css";

/** Fuseaux affichés : NY, London, HK. */
const ZONES: { label: string; timeZone: string }[] = [
  { label: "NY", timeZone: "America/New_York" },
  { label: "London", timeZone: "Europe/London" },
  { label: "HK", timeZone: "Asia/Hong_Kong" },
];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function getTimeInZone(timeZone: string) {
  const timeStr = new Date().toLocaleTimeString("en-GB", {
    timeZone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const [h, m] = timeStr.split(":").map(Number);
  return { hours: h ?? 0, minutes: m ?? 0 };
}

const flapProps = {
  chars: Presets.NUM as string,
  length: 2,
  padMode: "start" as const,
  timing: 25,
  className: "worldClockFlap",
};

/** Horloges monde (affichage type flap HH:mm). */
export default function WorldClocks() {
  const [mounted, setMounted] = useState(false);
  const [times, setTimes] = useState<Record<string, { hours: number; minutes: number }>>({});

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const next: Record<string, { hours: number; minutes: number }> = {};
      ZONES.forEach(({ label, timeZone }) => {
        next[label] = getTimeInZone(timeZone);
      });
      setTimes(next);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  if (!mounted) {
    return (
      <div className="worldClocks">
        {ZONES.map(({ label }) => (
          <div key={label} className="worldClockItem">
            <span className="worldClockLabel">{label}</span>
            <span className="worldClockTime">
              <FlapDisplay {...flapProps} value="00" />
              <span className="worldClockSep">:</span>
              <FlapDisplay {...flapProps} value="00" />
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="worldClocks">
      {ZONES.map(({ label, timeZone }) => {
        const t = times[label] ?? getTimeInZone(timeZone);
        return (
          <div key={label} className="worldClockItem">
            <span className="worldClockLabel">{label}</span>
            <span className="worldClockTime">
              <FlapDisplay {...flapProps} value={pad2(t.hours)} />
              <span className="worldClockSep">:</span>
              <FlapDisplay {...flapProps} value={pad2(t.minutes)} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
