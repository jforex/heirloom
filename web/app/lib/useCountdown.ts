"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "./format";

// Given last check-in + grace period (ms), returns a live-updating countdown.
export function useCountdown(lastCheckinMs: number, gracePeriodMs: number) {
  const releaseAtMs = lastCheckinMs + gracePeriodMs;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const remaining = releaseAtMs - now;
  return {
    releaseAtMs,
    released: remaining <= 0,
    remainingMs: formatDuration(remaining),
    remainingRaw: remaining,
  };
}
