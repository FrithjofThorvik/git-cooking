import { useEffect } from "react";
import { useCookies } from "react-cookie";

import { IGitCooking } from "types/interfaces";
import { defaultGameData } from "data/defaultData";

export const useGameData = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["git-cooking"]);
  const gameData: IGitCooking = cookies["git-cooking"];

  useEffect(() => {
    if (!cookies["git-cooking"]) {
      setGameData(defaultGameData);
    }
  }, []);

  const setGameData = (gameData: IGitCooking) => {
    setCookie("git-cooking", gameData, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return { gameData, setGameData };
};
