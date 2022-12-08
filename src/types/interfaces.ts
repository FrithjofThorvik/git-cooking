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
    input?: string,
    timeLapsed?: number
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

export interface ISummaryStats {
  profit: number;
  totalCost: number;
  totalRevenue: number;
  baseRevenue: number;
  baseCost: number;
  revenueMultiplier: number;
  useCostReduction: number;
  avgPercentage: number;
  bonusFromCostReduction: number;
  bonusFromMultiplier: number;
  bonusFromPercentage: number;
  bonusFromEndedDayTime: number;
  maxBonusFromPercentage: number;
}
