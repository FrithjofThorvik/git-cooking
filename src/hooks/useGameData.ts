import { useEffect, useState } from "react";

import { GameState } from "types/enums";
import { singletonHook } from "react-singleton-hook";
import { defaultGameData } from "data/defaultData";
import { defaultDirectory } from "data/defaultGitTree";
import { copyObjectWithoutRef } from "services/helpers";
import { IDirectory, IGitCooking } from "types/gameDataInterfaces";

var _ = require("lodash");

const init = defaultGameData;
let globalSetMode: any = () => {
  throw new Error("GameState error");
};

const useGameDataIml = () => {
  const [gameData, setData] = useState<IGitCooking>(init);

  useEffect(() => {
    if (!localStorage.getItem("git-cooking")) {
      let copyGit: IGitCooking = copyObjectWithoutRef(defaultGameData);
      copyGit.states.gameState = GameState.FETCH;
      setGameData(copyGit);
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
          let directoryWithFunctions: IDirectory = _.defaultsDeep(
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
    setData((prev) => ({ ...prev, ...gameData }));
  };
  globalSetMode = setGameData;

  return gameData;
};

export const useGameData = singletonHook(init, useGameDataIml);
export const setGameData = (gameData: IGitCooking) => globalSetMode(gameData);
