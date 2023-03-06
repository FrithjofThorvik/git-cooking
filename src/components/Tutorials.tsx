import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { useKeyPress } from "hooks/useKeyPress";
import { ITutorial, ITutorialScreen } from "types/gameDataInterfaces";
import TutorialsNav from "./tutorial/TutorialsNav";
import TutorialScreen from "./tutorial/TutorialScreen";

import "./Tutorials.scss";
import { TutorialType } from "types/enums";
import TutorialModal from "./TutorialModal";

interface IShownIndexState {
  tutorialIndex: number;
  screenIndex: number;
  promptIndex: number;
}

interface ITutorialState {
  tutorial: ITutorial;
  screen: ITutorialScreen;
  prompt: string;
  tutorialIndex: number;
  screenIndex: number;
  promptIndex: number;
}

interface ITutorialProps {
  tutorials: ITutorial[];
  unlockedTutorials: ITutorial[];
  stopGameTime?: boolean;
  hideOnCompletion?: boolean;
  hideOnLastTutorial?: boolean;
  typewriter?: boolean;
  onCompletion?: () => void;
  pauseGameTime?: (isPaused: boolean) => void;
  completeTutorials?: (tutorials: ITutorial[]) => void;
  setActiveTutorialTypes: (tutorialTypes: TutorialType[]) => void;
}

const Tutorials: React.FC<ITutorialProps> = ({
  tutorials,
  unlockedTutorials,
  stopGameTime,
  hideOnCompletion,
  hideOnLastTutorial,
  typewriter = false,
  setActiveTutorialTypes,
  onCompletion,
  pauseGameTime,
  completeTutorials,
}): JSX.Element => {
  const [state, setState] = useState<ITutorialState | null>(null);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [firstRender, setFirstRender] = useState<boolean>(false);
  const [showTypewrite, setShowTypewrite] = useState<boolean>(true);
  const [shownIndexes, setShownIndexes] = useState<IShownIndexState[]>([]);

  useKeyPress("Escape", () => closeTutorials());

  // show typewrite effect if the prompt hasn't been shown before
  const updateTypewrite = (
    tutorialIndex: number,
    screenIndex: number,
    promptIndex: number
  ) => {
    if (!state) return;
    if (
      !shownIndexes.some(
        (shownIndex) =>
          shownIndex.tutorialIndex === tutorialIndex &&
          shownIndex.screenIndex === screenIndex &&
          shownIndex.promptIndex === promptIndex
      )
    ) {
      setShowTypewrite(true);

      setShownIndexes((prev) => [
        ...prev,
        {
          tutorialIndex,
          screenIndex,
          promptIndex,
        },
      ]);
    }
  };

  const nextTutorial = () => {
    if (!state) return;
    if (completeTutorials) completeTutorials([state.tutorial]);
    if (state.tutorialIndex + 1 < tutorials.length) {
      const tutorialIndex = state.tutorialIndex + 1;
      const tutorial = tutorials[tutorialIndex];
      const screenIndex = 0;
      const screen = tutorial.screens[screenIndex];
      const promptIndex = 0;
      const prompt = screen.prompts[promptIndex];
      updateTypewrite(tutorialIndex, screenIndex, promptIndex);
      setState({
        tutorialIndex,
        tutorial,
        screenIndex,
        screen,
        promptIndex,
        prompt,
      });
    } else if (hideOnLastTutorial && onCompletion) {
      onCompletion();
      setState(null);
      setShownIndexes([]);
      setShowTypewrite(true);
      setIsHidden(true);
    }
  };

  const prevTutorial = () => {
    if (!state) return;
    if (state.tutorialIndex - 1 >= 0) {
      const tutorialIndex = state.tutorialIndex - 1;
      const tutorial = tutorials[tutorialIndex];
      const screenIndex = tutorial.screens.length - 1;
      const screen = tutorial.screens[screenIndex];
      const promptIndex = screen.prompts.length - 1;
      const prompt = screen.prompts[promptIndex];
      setState({
        tutorialIndex,
        tutorial,
        screenIndex,
        screen,
        promptIndex,
        prompt,
      });
    }
  };

  const nextScreen = () => {
    if (!state) return;
    if (state.screenIndex + 1 < state.tutorial.screens.length) {
      const screenIndex = state.screenIndex + 1;
      const screen = state.tutorial.screens[screenIndex];
      const promptIndex = 0;
      const prompt = screen.prompts[promptIndex];
      updateTypewrite(state.tutorialIndex, screenIndex, promptIndex);
      setState({
        ...state,
        screenIndex,
        screen,
        promptIndex,
        prompt,
      });
    } else nextTutorial();
  };

  const prevScreen = () => {
    if (!state) return;
    if (state.screenIndex - 1 >= 0) {
      const screenIndex = state.screenIndex - 1;
      const screen = state.tutorial.screens[screenIndex];
      const promptIndex = screen.prompts.length - 1;
      const prompt = screen.prompts[promptIndex];
      setState({ ...state, screenIndex, screen, promptIndex, prompt });
    } else prevTutorial();
  };

  const nextPrompt = () => {
    if (!state) return;

    // do not go to next tutorial if sentence is not finished typing
    if (typewriter && showTypewrite) {
      // skip sentence if trying to go to next tutorial, but not finished typing
      setShowTypewrite(false);
    } else if (state.promptIndex + 1 < state.screen.prompts.length) {
      const promptIndex = state.promptIndex + 1;
      const prompt = state.screen.prompts[promptIndex];
      updateTypewrite(state.tutorialIndex, state.screenIndex, promptIndex);
      setState({ ...state, promptIndex, prompt });
    } else nextScreen();
  };

  const prevPrompt = () => {
    if (!state) return;
    if (state.promptIndex - 1 >= 0) {
      const promptIndex = state.promptIndex - 1;
      const prompt = state.screen.prompts[promptIndex];
      setState({ ...state, promptIndex, prompt });
    } else prevScreen();
  };

  const setTutorial = (tutorial: ITutorial) => {
    tutorials.forEach((t, i) => {
      if (t.type === tutorial.type) {
        const tutorialIndex = i;
        const tutorial = tutorials[tutorialIndex];
        const screenIndex = 0;
        const screen = tutorial.screens[screenIndex];
        const promptIndex = 0;
        const prompt = screen.prompts[promptIndex];
        setState({
          tutorialIndex,
          tutorial,
          screenIndex,
          screen,
          promptIndex,
          prompt,
        });

        const shownIndexes = [{ tutorialIndex, screenIndex, promptIndex }];
        setShownIndexes(shownIndexes);
      }
    });
  };

  const isTutorialsCompleted = (tutorials: ITutorial[]) => {
    let isCompleted = true;
    tutorials.forEach((t) => {
      if (!t.completed) isCompleted = false;
    });
    return isCompleted;
  };

  const isTutorialsValid = (tutorials: ITutorial[]) => {
    if (tutorials.length > 0) {
      if (tutorials[0].screens.length > 0) {
        if (tutorials[0].screens[0].prompts.length > 0) return true;
      }
    }
    return false;
  };

  const closeTutorials = () => {
    if (completeTutorials) completeTutorials(tutorials);
    if (onCompletion) onCompletion();
    setState(null);
    setShownIndexes([]);
    setShowTypewrite(true);
    setIsHidden(true);
  };

  // Update state when tutorials is updated
  useEffect(() => {
    const tutorialsIsValid = isTutorialsValid(tutorials);

    if (hideOnCompletion) {
      const tutorialsCompleted = isTutorialsCompleted(tutorials);

      if (!state && tutorialsIsValid && !tutorialsCompleted) {
        setState({
          tutorial: tutorials[0],
          screen: tutorials[0].screens[0],
          prompt: tutorials[0].screens[0].prompts[0],
          tutorialIndex: 0,
          screenIndex: 0,
          promptIndex: 0,
        });
        setIsHidden(false);
        setShownIndexes([]);
        setShowTypewrite(true);
      } else if (tutorials.length > 0 && tutorialsCompleted) {
        setIsHidden(true);
        setState(null);
        setShownIndexes([]);
        setShowTypewrite(true);
      } else if (tutorials.length > 0 && !tutorialsCompleted) {
        setIsHidden(false);
      } else {
        setIsHidden(true);
      }
    } else if (hideOnLastTutorial) {
      if (!state && tutorialsIsValid) {
        setState({
          tutorial: tutorials[0],
          screen: tutorials[0].screens[0],
          prompt: tutorials[0].screens[0].prompts[0],
          tutorialIndex: 0,
          screenIndex: 0,
          promptIndex: 0,
        });
        setIsHidden(false);
        setShownIndexes([]);
        setShowTypewrite(true);
      }
    }
  }, [tutorials, state]);

  // Pause game time after first render, if enabled
  useEffect(() => {
    if (!firstRender) setFirstRender(true);
    else if (stopGameTime && pauseGameTime) pauseGameTime(!isHidden);
  }, [isHidden]);

  if ((hideOnCompletion && isHidden) || !state) {
    if (unlockedTutorials.length === 0) return <></>;
    const modalHandleClick = (tutorialTypes: TutorialType[]) => {
      setIsHidden(false);
      setActiveTutorialTypes(tutorialTypes);
    };
    return (
      <TutorialModal
        unlockedTutorials={unlockedTutorials}
        handleClick={modalHandleClick}
      />
    );
  }
  return (
    <div className="tutorial">
      <div className="tutorial-close" onClick={() => closeTutorials()}>
        <CloseIcon />
      </div>
      <TutorialScreen
        typewriter={typewriter ? showTypewrite : false}
        setShowTypewrite={setShowTypewrite}
        tutorial={state.tutorial}
        hideGoBack={
          state.promptIndex === 0 &&
          state.screenIndex === 0 &&
          state.tutorialIndex === 0
        }
        screen={state.screen}
        prompt={state.prompt}
        screenIndex={state.screenIndex}
        promptIndex={state.promptIndex}
        nextPrompt={nextPrompt}
        prevPrompt={prevPrompt}
      />
      <TutorialsNav
        tutorials={tutorials}
        tutorial={state.tutorial}
        next={nextTutorial}
        prev={prevTutorial}
        setTutorial={setTutorial}
      />
    </div>
  );
};

export default Tutorials;
