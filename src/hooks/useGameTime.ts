import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";

const init = 0;
let globalSetMode: any = () => {
  throw new Error("GameState error");
};

const useGameTimeIml = () => {
  const [timeLapsed, setTimeLapsed] = useState<number>(init);

  useEffect(() => {
    if (!localStorage.getItem("git-cooking-time")) {
      setTimeLapsed(0);
    } else {
      const time = localStorage.getItem("git-cooking-time");
      if (time) {
        setTimeLapsed(Number(time));
      }
    }
  }, []);

  const setGameTime = (timeLapsed: number) => {
    localStorage.setItem("git-cooking-time", timeLapsed.toString());
    setTimeLapsed(timeLapsed);
  };
  globalSetMode = setGameTime;

  return timeLapsed;
};

export const useGameTime = singletonHook(init, useGameTimeIml);
export const setGameTime = (timeLapsed: number) => globalSetMode(timeLapsed);
