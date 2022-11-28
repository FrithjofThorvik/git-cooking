import { useEffect, useState } from "react";

import { useGameData } from "./useGameData";
import { setGameTime, useGameTime } from "./useGameTime";

export const useTimeLapsed = (
  dayLengthModifier: number,
  ms: number,
  handleEnd: () => void
): void => {
  const [referenceTime, setReferenceTime] = useState(Date.now());
  const gameData = useGameData();
  const timeLapsed = useGameTime();

  useEffect(() => {
    const timeId = setTimeout(() => {
      const prevTime = timeLapsed;

      const now = Date.now();
      const dt = now - referenceTime;
      setReferenceTime(now);

      let newTimeLapsed = prevTime + dt;
      const dayLength = gameData.stats.dayLength.get(gameData.store.upgrades);

      if (newTimeLapsed > dayLength) {
        handleEnd();
        setGameTime(0);
      } else setGameTime(newTimeLapsed);
    }, ms);

    return () => {
      clearTimeout(timeId);
    };
  }, [timeLapsed]);
};
