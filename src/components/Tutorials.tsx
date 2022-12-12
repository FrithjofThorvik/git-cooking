import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { ITutorial, ITutorialScreen } from "types/gameDataInterfaces";
import TutorialsNav from "./tutorial/TutorialsNav";
import TutorialScreen from "./tutorial/TutorialScreen";

import "./Tutorials.scss";
import { useKeyPress } from "hooks/useKeyPress";

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
  stopGameTime?: boolean;
  hideOnCompletion?: boolean;
  hideOnLastTutorial?: boolean;
  onCompletion?: () => void;
  pauseGameTime?: (isPaused: boolean) => void;
  completeTutorial?: (tutorial: ITutorial) => void;
}

const Tutorials: React.FC<ITutorialProps> = ({
  tutorials,
  stopGameTime,
  hideOnCompletion,
  hideOnLastTutorial,
  onCompletion,
  pauseGameTime,
  completeTutorial,
}): JSX.Element => {
  const [state, setState] = useState<ITutorialState | null>(null);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [firstRender, setFirstRender] = useState<boolean>(false);

  useKeyPress("Escape", () => closeTutorials(true));

  const nextTutorial = () => {
    if (!state) return;
    if (completeTutorial) completeTutorial(state.tutorial);
    if (state.tutorialIndex + 1 < tutorials.length) {
      const tutorialIndex = state.tutorialIndex + 1;
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
    } else if (hideOnLastTutorial && onCompletion) {
      onCompletion();
      setState(null);
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
    if (state.promptIndex + 1 < state.screen.prompts.length) {
      const promptIndex = state.promptIndex + 1;
      const prompt = state.screen.prompts[promptIndex];
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

  const closeTutorials = (completeTutorials: boolean) => {
    if (completeTutorials && completeTutorial)
      tutorials.forEach((t) => completeTutorial(t));
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
      } else if (tutorials.length > 0 && tutorialsCompleted) {
        setIsHidden(true);
        setState(null);
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
      }
    }
  }, [tutorials, state]);

  // Pause game time after first render, if enabled
  useEffect(() => {
    if (!firstRender) setFirstRender(true);
    else if (stopGameTime && pauseGameTime) pauseGameTime(!isHidden);
  }, [isHidden]);

  if ((hideOnCompletion && isHidden) || !state) return <></>;
  return (
    <div className="tutorial">
      <div className="tutorial-close" onClick={() => closeTutorials(true)}>
        <CloseIcon />
      </div>
      <TutorialScreen
        tutorial={state.tutorial}
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
