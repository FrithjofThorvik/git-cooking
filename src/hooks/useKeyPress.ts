import { useEffect, useState } from "react";

export const useKeyPress = (
  targetKey: string,
  handleKeyPress: () => void,
  onUp = false
) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  const downHandler = (e: KeyboardEvent) => {
    e.key === targetKey && setKeyPressed(true);
  };

  const upHandler = (e: KeyboardEvent) => {
    e.key === targetKey && setKeyPressed(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  useEffect(() => {
    if (keyPressed) {
      if (!onUp) handleKeyPress();
    } else {
      if (onUp) handleKeyPress();
    }
  }, [keyPressed]);
};
