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
    (t) => t.type === TutorialType.CLONE
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
    let updatedGameData: IGitCooking = copyObjectWithoutRef(gameData);
    let updatedStats = updatedGameData.stats;

    const activeProject = updatedGameData.git.getActiveProject();
    const updatedGitTree = updatedGameData.git.activateProject(project);
    if (activeProject)
      updatedStats = updatedGameData.stats.switchProjectStats(
        activeProject,
        project
      );

    const activeProjectIndex = updatedGitTree.projects.findIndex(
      (p) => p.type === project.type
    );
    if (activeProjectIndex !== -1) {
      updatedGameData.git = updatedGitTree;
      updatedGameData.stats = updatedStats;
      updatedGameData.git.projects[activeProjectIndex].remote =
        gameData.git.projects[activeProjectIndex].remote.updateBranchStats(
          updatedGameData
        );
    }

    setGameData({ ...updatedGameData });
  };

  useEffect(() => {
    setActiveTutorialTypes([TutorialType.GAME_INTRO, TutorialType.TERMINAL]);
    if (gameData.git.projects.some((p) => p.cloned)) {
      setActiveTutorialTypes([TutorialType.CLONE]);
    }
  }, [gameData.git.projects]);

  useEffect(() => {
    if (
      gameData.states.day === 1 &&
      gameData.git.projects.some((p) => p.cloned)
    ) {
      setActiveTutorialTypes([TutorialType.FETCH]);
      if (
        gameData.git
          .getActiveProject()
          ?.remote.branches.filter((b) => !b.isMain)
          .some((b) => b.isFetched)
      ) {
        setActiveTutorialTypes([TutorialType.FETCH]);
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
      (t) => t.type === TutorialType.CLONE
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
