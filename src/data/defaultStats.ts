import { copyObjectWithoutRef, toMilliseconds } from "services/helpers";
import { IStats } from "types/gameDataInterfaces";
import { IProject } from "types/gitInterfaces";

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
  switchProjectStats(prevProject: IProject, newProject: IProject) {
    let copy: IStats = copyObjectWithoutRef(this);

    copy.dayLength.value =
      (copy.dayLength.value * newProject.stats.timeReduction) /
      prevProject.stats.timeReduction;
    copy.revenueMultiplier.value =
      (copy.revenueMultiplier.value * newProject.stats.cashMultiplier) /
      prevProject.stats.cashMultiplier;

    return copy;
  },
};
