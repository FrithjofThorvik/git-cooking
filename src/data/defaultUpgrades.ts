import { v4 } from "uuid";

import {
  imgClock,
  imgCostReduction,
  imgDiscount,
  imgRevenueMultiplier,
} from "assets";
import { IStats, IUpgrade } from "types/gameDataInterfaces";
import { UpgradeType } from "types/enums";
import { copyObjectWithoutRef } from "services/helpers";
import { upgradeBalancing } from "./balancing";

export const defaultUpgrades: IUpgrade[] = [
  {
    id: v4(),
    image: imgClock,
    unlocked: false,
    unlockDay: upgradeBalancing.dayLength.unlockDay,
    purchased: false,
    type: UpgradeType.DAY_LENGTH,
    level: 1,
    maxLevel: 5,
    name: function () {
      return `Day Length`;
    },
    description: function () {
      return `Increase Day Length by ${((this.effect().next - 1) * 100).toFixed(
        1
      )}%`;
    },
    effect: function () {
      const current = upgradeBalancing.dayLength.effect(this.level);
      const next = upgradeBalancing.dayLength.effect(this.level + 1);
      return { current, next };
    },
    apply: function (stats: IStats) {
      let copyStats: IStats = copyObjectWithoutRef(stats);
      copyStats.dayLength.value =
        copyStats.dayLength.base * this.effect().current;

      return copyStats;
    },
    cost: function (discountMultiplier: number) {
      return Math.round(
        upgradeBalancing.dayLength.cost(this.level) * discountMultiplier
      );
    },
  },
  {
    id: v4(),
    image: imgDiscount,
    name: function () {
      return `Discount`;
    },
    description: function () {
      return `Reduce upgrade cost by ${((1 - this.effect().next) * 100).toFixed(
        1
      )}%`;
    },
    unlocked: false,
    unlockDay: upgradeBalancing.discount.unlockDay,
    purchased: false,
    type: UpgradeType.DISCOUNT,
    level: 1,
    maxLevel: 5,
    effect: function () {
      const current = upgradeBalancing.discount.effect(this.level);
      const next = upgradeBalancing.discount.effect(this.level + 1);
      return { current: current, next: next };
    },
    apply: function (stats: IStats) {
      let copyStats: IStats = copyObjectWithoutRef(stats);
      copyStats.discountMultiplier.value =
        copyStats.discountMultiplier.base * this.effect().current;

      return copyStats;
    },
    cost: function (discountMultiplier: number) {
      return Math.round(
        upgradeBalancing.discount.cost(this.level) * discountMultiplier
      );
    },
  },
  {
    id: v4(),
    image: imgCostReduction,
    unlocked: false,
    unlockDay: upgradeBalancing.costReduction.unlockDay,
    purchased: false,
    type: UpgradeType.COST_REDUCTION,
    level: 1,
    maxLevel: 5,
    name: function () {
      return `Reduce use cost`;
    },
    description: function () {
      return `Reduce ingredient use cost by ${(
        (1 - this.effect().next) *
        100
      ).toFixed(1)}%`;
    },
    effect: function () {
      const current = upgradeBalancing.costReduction.effect(this.level);
      const next = upgradeBalancing.costReduction.effect(this.level + 1);
      return { current: current, next: next };
    },
    apply: function (stats: IStats) {
      let copyStats: IStats = copyObjectWithoutRef(stats);
      copyStats.useCostReductionMultiplier.value =
        copyStats.useCostReductionMultiplier.base * this.effect().current;

      return copyStats;
    },
    cost: function (discountMultiplier: number) {
      return Math.round(
        upgradeBalancing.costReduction.cost(this.level) * discountMultiplier
      );
    },
  },
  {
    id: v4(),
    image: imgRevenueMultiplier,
    unlocked: false,
    unlockDay: upgradeBalancing.revenueMultiplier.unlockDay,
    purchased: false,
    type: UpgradeType.REVENUE_MULTIPLIER,
    level: 1,
    maxLevel: 5,
    name: function () {
      return `Increase revenue`;
    },
    description: function () {
      return `Increase revenue by ${((this.effect().next - 1) * 100).toFixed(
        1
      )}%`;
    },
    effect: function () {
      const current = upgradeBalancing.revenueMultiplier.effect(this.level);
      const next = upgradeBalancing.revenueMultiplier.effect(this.level + 1);
      return { current: current, next: next };
    },
    apply: function (stats: IStats) {
      let copyStats: IStats = copyObjectWithoutRef(stats);
      copyStats.revenueMultiplier.value *= this.effect().current;
      return copyStats;
    },
    cost: function (discountMultiplier: number) {
      return Math.round(
        upgradeBalancing.revenueMultiplier.cost(this.level) * discountMultiplier
      );
    },
  },
  {
    id: v4(),
    image: imgRevenueMultiplier,
    unlocked: false,
    unlockDay: upgradeBalancing.spawnTime.unlockDay,
    purchased: false,
    type: UpgradeType.SPAWN_TIME,
    level: 1,
    maxLevel: 5,
    name: function () {
      return `Reduce order arrive time`;
    },
    description: function () {
      return `Reduce order arrive time by ${(
        (1 - this.effect().next) *
        100
      ).toFixed(1)}%`;
    },
    effect: function () {
      const current = upgradeBalancing.spawnTime.effect(this.level);
      const next = upgradeBalancing.spawnTime.effect(this.level + 1);
      return { current: current, next: next };
    },
    apply: function (stats: IStats) {
      let copyStats: IStats = copyObjectWithoutRef(stats);
      copyStats.spawnTime.value =
        copyStats.spawnTime.base * this.effect().current;

      return copyStats;
    },
    cost: function (discountMultiplier: number) {
      return Math.round(
        upgradeBalancing.spawnTime.cost(this.level) * discountMultiplier
      );
    },
  },
];
