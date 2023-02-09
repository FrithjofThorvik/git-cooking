import React, { useEffect, useState } from "react";

import { IProject, IRemoteBranch } from "types/gitInterfaces";
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
  const cloneTutorial = gameData.help.tutorials.find(
    (t) => t.type === TutorialType.CLONE_CONTENT
  );
  const [tutorialCompleted, setTutorialCompleted] = useState<boolean>(
    cloneTutorial ? cloneTutorial.completed : false
  );
  const [displayBranches, setDisplayBranches] = useState<IRemoteBranch[]>(
    project
      ? project.remote.branches.filter((rb) => rb.isFetched && !rb.isMain)
      : []
  );

  const activateProject = (project: IProject) => {
    let updatedStats = gameData.stats;

    const updatedGitTree = gameData.git.activateProject(project);
    const activeProject = gameData.git.getActiveProject();
    if (activeProject)
      updatedStats = gameData.stats.switchProjectStats(activeProject, project);
    setGameData({ ...gameData, git: updatedGitTree, stats: updatedStats });
  };

  useEffect(() => {
    setActiveTutorialTypes([TutorialType.CLONE_INTRO]);
    if (gameData.git.projects.some((p) => p.cloned)) {
      setActiveTutorialTypes([TutorialType.CLONE_CONTENT]);
    }
  }, [gameData.git.projects]);

  useEffect(() => {
    if (
      gameData.states.day === 1 &&
      gameData.git.projects.some((p) => p.cloned)
    ) {
      setActiveTutorialTypes([TutorialType.FETCH_INTRO]);
      if (
        gameData.git
          .getActiveProject()
          ?.remote.branches.filter((b) => !b.isMain)
          .some((b) => b.isFetched)
      ) {
        setActiveTutorialTypes([TutorialType.FETCH_CONTENT]);
      }
    }
  }, [gameData.git.getActiveProject()?.remote.branches, gameData.git.projects]);

  // Starts day when a remote branch has been checkout out
  useEffect(() => {
    let updatedGameData: IGitCooking = copyObjectWithoutRef(gameData);
    if (
      !updatedGameData.git.branches.some((b) => {
        let remoteBranch = null;
        if (b.remoteTrackingBranch)
          remoteBranch = updatedGameData.git.getRemoteBranch(
            b.remoteTrackingBranch
          );
        return remoteBranch && !remoteBranch.isMain;
      })
    )
      return;
    updatedGameData = updatedGameData.startDay();
    setGameData({ ...updatedGameData });
  }, [gameData.git.branches]);

  useEffect(() => {
    setDisplayBranches(
      project
        ? project.remote.branches.filter((rb) => rb.isFetched && !rb.isMain)
        : []
    );
  }, [project]);

  useEffect(() => {
    const cloneTutorial = gameData.help.tutorials.find(
      (t) => t.type === TutorialType.CLONE_CONTENT
    );
    if (cloneTutorial?.completed) setTutorialCompleted(true);
  }, [gameData.help.tutorials]);

  if (!project) return <></>;
  return (
    <FetchScreen
      projects={gameData.git.projects}
      tutorialCompleted={tutorialCompleted}
      project={project}
      displayBranches={displayBranches}
      terminalController={<TerminalController />}
      isFirstDay={gameData.states.day === 0}
      goBack={goBack}
      activateProject={activateProject}
    />
  );
};

export default FetchScreenController;
