import React, { useEffect } from "react";

import { IProject } from "types/gitInterfaces";
import { IGitCooking } from "types/gameDataInterfaces";
import { TutorialType } from "types/enums";
import { copyObjectWithoutRef } from "services/helpers";
import { setGameData, useGameData } from "hooks/useGameData";
import FetchScreen from "components/screens/FetchScreen";
import TerminalController from "controllers/components/work/TerminalController";

interface IFetchScreenControllerProps {
  setActiveTutorialTypes: (tutorials: TutorialType[]) => void;
  goBack: () => void;
}

const FetchScreenController: React.FC<IFetchScreenControllerProps> = ({
  setActiveTutorialTypes,
  goBack,
}): JSX.Element => {
  const gameData = useGameData();
  const project = gameData.git.getActiveProject();

  const activateProject = (project: IProject) => {
    let updatedStats = gameData.stats;

    const updatedGitTree = gameData.git.activateProject(project);
    const activeProject = gameData.git.getActiveProject();
    if (activeProject)
      updatedStats = gameData.stats.switchProjectStats(activeProject, project);
    console.log(updatedStats);
    setGameData({ ...gameData, git: updatedGitTree, stats: updatedStats });
  };

  useEffect(() => {
    // setActiveTutorialTypes([TutorialType.FETCH_INTRO]);
    // if (
    //   gameData.git.getActiveProject()?.remote.branches.some((b) => b.isFetched)
    // ) {
    //   setActiveTutorialTypes([TutorialType.FETCH_CONTENT]);
    // }
  }, [gameData.git.getActiveProject()?.remote.branches]);

  // Starts day when a remote branch has been checkout out
  useEffect(() => {
    let updatedGameData: IGitCooking = copyObjectWithoutRef(gameData);
    if (
      !updatedGameData.git.branches.some(
        (b) =>
          b.remoteTrackingBranch &&
          updatedGameData.git
            .getActiveProject()
            ?.remote.getRemoteBranch(b.remoteTrackingBranch)
      )
    )
      return;
    updatedGameData = updatedGameData.startDay();
    setGameData({ ...updatedGameData });
  }, [gameData.git.branches]);

  if (!project) return <></>;
  return (
    <FetchScreen
      projects={gameData.git.projects}
      project={project}
      terminalController={<TerminalController />}
      isFirstDay={gameData.states.day === 0}
      goBack={goBack}
      activateProject={activateProject}
    />
  );
};

export default FetchScreenController;
