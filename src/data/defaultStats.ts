import { IStats } from "types/gameDataInterfaces";

const baseDiscountMultiplier = 1;
const baseDayLength = 960000;
const baseCostReductionMultiplier = 1;
const baseRevenueMultiplier = 1;
const baseSpawnTime = 10000;

export const defaultStats: IStats = {
  discountMultiplier: {
    base: baseDiscountMultiplier,
    value: baseDiscountMultiplier,
  },
  dayLength: {
    base: baseDayLength,
    value: baseDayLength,
  },
  costReductionMultiplier: {
    base: baseCostReductionMultiplier,
    value: baseCostReductionMultiplier,
  },
  revenueMultiplier: {
    base: baseRevenueMultiplier,
    value: baseRevenueMultiplier,
  },
  spawnTime: {
    base: baseSpawnTime,
    value: baseSpawnTime,
  },
};
