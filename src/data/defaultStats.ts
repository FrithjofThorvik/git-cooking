import { UpgradeType } from "types/enums";
import { IStats, IUpgrade } from "types/gameDataInterfaces";

export const defaultStats: IStats = {
  discountMultiplier: {
    base: 1,
    get: function (upgrades: IUpgrade[]) {
      let totalDiscountMultiplier = this.base;

      upgrades.forEach((u) => {
        if (u.type === UpgradeType.DISCOUNT) {
          totalDiscountMultiplier = u.apply(totalDiscountMultiplier);
        }
      });

      return totalDiscountMultiplier;
    },
  },
  dayLength: {
    base: 60000,
    get: function (upgrades: IUpgrade[]) {
      let totalDayLength = this.base;

      upgrades.forEach((u) => {
        if (u.type === UpgradeType.DAY_LENGTH) {
          totalDayLength = u.apply(totalDayLength);
        }
      });

      return totalDayLength;
    },
  },
  costReductionMultiplier: {
    base: 1,
    get: function (upgrades: IUpgrade[]) {
      let totalCostReductionMultiplier = this.base;

      upgrades.forEach((u) => {
        if (u.type === UpgradeType.COST_REDUCTION) {
          totalCostReductionMultiplier = u.apply(totalCostReductionMultiplier);
        }
      });

      return totalCostReductionMultiplier;
    },
  },
  revenueMultiplier: {
    base: 1,
    get: function (upgrades: IUpgrade[]) {
      let totalRevenueMultiplier = this.base;

      upgrades.forEach((u) => {
        if (u.type === UpgradeType.REVENUE_MULTIPLIER)
          totalRevenueMultiplier = u.apply(totalRevenueMultiplier);
      });

      return totalRevenueMultiplier;
    },
  },
  spawnTime: {
    base: 10000,
    get: function (upgrades: IUpgrade[]) {
      let totalDiscountMultiplier = this.base;

      upgrades.forEach((u) => {
        if (u.type === UpgradeType.SPAWN_TIME) {
          totalDiscountMultiplier = u.apply(totalDiscountMultiplier);
        }
      });

      return totalDiscountMultiplier;
    },
  },
};
