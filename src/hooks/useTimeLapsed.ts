import { useEffect, useState } from "react";

import { useGameData } from "./useGameData";
import { setGameTime, useGameTime } from "./useGameTime";

export const useTimeLapsed = (dayLengthModifier: number, ms: number): void => {
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
      const dayLength = gameData.baseDayLength * dayLengthModifier;
      if (newTimeLapsed > dayLength) newTimeLapsed = dayLength;

      setGameTime(newTimeLapsed);
    }, ms);

    return () => {
      clearTimeout(timeId);
    };
  }, [timeLapsed]);
};
