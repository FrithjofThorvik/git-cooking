import { IGitCooking } from "./gameDataInterfaces";

export interface IGitResponse {
  message: string;
  success: boolean;
}

export interface ICommandArg {
  key: string;
  args: ICommandArg[];
  cmd: (
    gameData: IGitCooking,
    setGameData: (gameData: IGitCooking) => void,
    input?: string
  ) => IGitResponse;
  isDynamic?: boolean;
}

export interface IArcProgressClock {
  time: string;
  color: string;
  endAngle: number;
  progress: number;
  startAngle: number;
}
