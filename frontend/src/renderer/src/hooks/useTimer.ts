import { useState, useEffect } from "react";

type UseTimerResult = {
  remainingSeconds: number;
  isExpired: boolean;
  elapsedSeconds: number;
};

export const useTimer = (
  startTime: string,
  limitSeconds: number,
): UseTimerResult => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const startMs = new Date(startTime).getTime();
  const elapsedSeconds = Math.max(0, (now - startMs) / 1000);
  const remainingSeconds = Math.max(0, limitSeconds - elapsedSeconds);
  const isExpired = remainingSeconds <= 0;

  return { remainingSeconds, isExpired, elapsedSeconds };
};
