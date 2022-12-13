import { useEffect, useState } from "react";

import { useGameData } from "./useGameData";
import { setGameTime, useGameTime } from "./useGameTime";

export const useTimeLapsed = (ms: number, handleEnd: () => void): void => {
  const gameData = useGameData();
  const [referenceTime, setReferenceTime] = useState(Date.now());
  const [pausedTime, setPausedTime] = useState<number>(0);
  const { timeLapsed, isPaused } = useGameTime();

  useEffect(() => {
    const timeId = setTimeout(() => {
      if (gameData.states.isDayComplete) return;

      const prevTime = timeLapsed;

      const now = Date.now();
      const dt = now - referenceTime;
      setReferenceTime(now);

      let newTimeLapsed = prevTime + dt;
      const dayLength = gameData.stats.dayLength.value;

      if (isPaused) {
        setPausedTime(pausedTime + 1);
      } else if (newTimeLapsed > dayLength) {
        handleEnd();
        setGameTime(0);
      } else setGameTime(newTimeLapsed);
    }, ms);

    return () => clearTimeout(timeId);
  }, [timeLapsed, isPaused, pausedTime, gameData.states.isDayComplete]);
};
