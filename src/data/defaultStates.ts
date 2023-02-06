import { IStates } from "types/gameDataInterfaces";
import { GameState } from "types/enums";

export const defaultStates: IStates = {
  day: 0,
  isDayComplete: false,
  hasStartedFetch: false,
  endedDayTime: 0,
  gameState: GameState.LOADING,
  setGameState: function (state) {
    let copy: IStates = this;
    copy.gameState = state;
    return copy;
  },
};
