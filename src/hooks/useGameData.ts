import { useEffect, useState } from "react";

import { IGitCooking } from "types/gameDataInterfaces";
import { singletonHook } from "react-singleton-hook";
import { defaultGameData, emptyGameData } from "data/defaultData";
import { copyObjectWithoutRef } from "services/helpers";
import { defaultDirectory } from "data/defaultGitTree";

var _ = require("lodash");

const init = emptyGameData;
let globalSetMode: any = () => {
  throw new Error("GameState error");
};

const useGameDataIml = () => {
  const [gameData, setData] = useState<IGitCooking>(init);

  useEffect(() => {
    if (!localStorage.getItem("git-cooking")) {
      setGameData(defaultGameData);
    } else {
      const data = localStorage.getItem("git-cooking");
      if (data) {
        const updatedGameData: IGitCooking = JSON.parse(data);
        const gameDataWithFunctions = copyObjectWithoutRef(defaultGameData);
        let updatedGameDataWithFunctions: IGitCooking = _.defaultsDeep(
          updatedGameData,
          gameDataWithFunctions
        );
        updatedGameDataWithFunctions.git.commits.forEach((c, i) => {
          const directoryWithFunctions = _.defaultsDeep(
            copyObjectWithoutRef(c.directory),
            copyObjectWithoutRef(defaultDirectory)
          );
          updatedGameDataWithFunctions.git.commits[i].directory =
            directoryWithFunctions;
        });
        setData(updatedGameDataWithFunctions);
      }
    }
  }, []);

  const setGameData = (gameData: IGitCooking) => {
    localStorage.setItem("git-cooking", JSON.stringify(gameData));
    setData(gameData);
  };
  globalSetMode = setGameData;

  return gameData;
};

export const useGameData = singletonHook(init, useGameDataIml);
export const setGameData = (gameData: IGitCooking) => globalSetMode(gameData);
