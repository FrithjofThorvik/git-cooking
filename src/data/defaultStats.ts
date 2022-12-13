import { toMilliseconds } from "services/helpers";
import { IStats } from "types/gameDataInterfaces";

const baseDiscountMultiplier = 1;
const baseDayLength = toMilliseconds(2, 0);
const baseCostReductionMultiplier = 1;
const baseRevenueMultiplier = 1;
const baseSpawnTime = toMilliseconds(0, 10);

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
