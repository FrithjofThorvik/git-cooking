import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";

interface IGameTime {
  timeLapsed: number;
  isPaused: boolean;
}
const init = { timeLapsed: 0, isPaused: false };
let globalSetMode: any = () => {
  throw new Error("GameState error");
};

const useGameTimeIml = () => {
  const [state, setState] = useState<IGameTime>(init);

  useEffect(() => {
    if (!localStorage.getItem("git-cooking-time")) {
      setState(init);
    } else {
      let localState = localStorage.getItem("git-cooking-time");
      if (localState) {
        const updatedState: IGameTime = JSON.parse(localState);
        setState(updatedState);
      }
    }
  }, []);

  const setGameTime = (timeLapsed: number, isPaused?: boolean) => {
    let updatedState = state;
    if (isPaused !== undefined) updatedState = { timeLapsed, isPaused };
    else updatedState.timeLapsed = timeLapsed;

    localStorage.setItem("git-cooking-time", JSON.stringify(updatedState));
    setState(updatedState);
  };
  globalSetMode = setGameTime;

  return state;
};

export const useGameTime = singletonHook(init, useGameTimeIml);
export const setGameTime = (timeLapsed: number, isPaused?: boolean) =>
  globalSetMode(timeLapsed, isPaused);
