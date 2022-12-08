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

export const defaultUpgrades: IUpgrade[] = [
  {
    id: v4(),
    image: imgClock,
    unlocked: false,
    unlockDay: 1,
    purchased: false,
    type: UpgradeType.DAY_LENGTH,
    level: 1,
    maxLevel: 5,
    name: function () {
      return `Day Length`;
    },
    description: function () {
      return `Increases Day Length by x${this.effect().next.toFixed(2)}`;
    },
    effect: function () {
      const base = 1.39;
      const current = Math.pow(base, this.level - 1);
      const next = Math.pow(base, this.level);
      return { current, next };
    },
    apply: function (stats: IStats) {
      let copyStats: IStats = copyObjectWithoutRef(stats);
      copyStats.dayLength.value =
        copyStats.dayLength.base * this.effect().current;

      return copyStats;
    },
    cost: function (discountMultiplier: number) {
      const base = 50;
      return Math.round(this.level * base * discountMultiplier);
    },
  },
  {
    id: v4(),
    image: imgDiscount,
    name: function () {
      return `Discount`;
    },
    description: function () {
      return `Reduces upgrade cost by x${this.effect().next.toFixed(2)}`;
    },
    unlocked: false,
    unlockDay: 3,
    purchased: false,
    type: UpgradeType.DISCOUNT,
    level: 1,
    maxLevel: 5,
    effect: function () {
      const base = 0.85;
      const current = Math.pow(base, this.level - 1);
      const next = Math.pow(base, this.level);
      return { current: current, next: next };
    },
    apply: function (stats: IStats) {
      let copyStats: IStats = copyObjectWithoutRef(stats);
      copyStats.discountMultiplier.value =
        copyStats.discountMultiplier.base * this.effect().current;

      return copyStats;
    },
    cost: function (discountMultiplier: number) {
      const base = 100;
      return this.level * base * discountMultiplier;
    },
  },
  {
    id: v4(),
    image: imgCostReduction,
    unlocked: false,
    unlockDay: 5,
    purchased: false,
    type: UpgradeType.COST_REDUCTION,
    level: 1,
    maxLevel: 5,
    name: function () {
      return `Reduce cost`;
    },
    description: function () {
      return `Reduces ingredient cost by x${this.effect().next.toFixed(2)}`;
    },
    effect: function () {
      const base = 0.9;
      const current = Math.pow(base, this.level - 1);
      const next = Math.pow(base, this.level);
      return { current: current, next: next };
    },
    apply: function (stats: IStats) {
      let copyStats: IStats = copyObjectWithoutRef(stats);
      copyStats.costReductionMultiplier.value =
        copyStats.costReductionMultiplier.base * this.effect().current;

      return copyStats;
    },
    cost: function (discountMultiplier: number) {
      const base = 250;
      return this.level * base * discountMultiplier;
    },
  },
  {
    id: v4(),
    image: imgRevenueMultiplier,
    unlocked: false,
    unlockDay: 6,
    purchased: false,
    type: UpgradeType.REVENUE_MULTIPLIER,
    level: 1,
    maxLevel: 5,
    name: function () {
      return `Increase revenue`;
    },
    description: function () {
      return `Increase revenue by x${this.effect().next.toFixed(2)}`;
    },
    effect: function () {
      const base = 1.7;
      const current = Math.pow(base, this.level - 1);
      const next = Math.pow(base, this.level);
      return { current: current, next: next };
    },
    apply: function (stats: IStats) {
      let copyStats: IStats = copyObjectWithoutRef(stats);
      copyStats.revenueMultiplier.value =
        copyStats.revenueMultiplier.base * this.effect().current;

      return copyStats;
    },
    cost: function (discountMultiplier: number) {
      const base = 500;
      return this.level * base * discountMultiplier;
    },
  },
  {
    id: v4(),
    image: imgRevenueMultiplier,
    unlocked: false,
    unlockDay: 1,
    purchased: false,
    type: UpgradeType.SPAWN_TIME,
    level: 1,
    maxLevel: 5,
    name: function () {
      return `Reduce customer spawn time`;
    },
    description: function () {
      return `Reduce spawn time by x${this.effect().next.toFixed(2)}`;
    },
    effect: function () {
      const base = 0.85;
      const current = Math.pow(base, this.level - 1);
      const next = Math.pow(base, this.level);
      return { current: current, next: next };
    },
    apply: function (stats: IStats) {
      let copyStats: IStats = copyObjectWithoutRef(stats);
      copyStats.spawnTime.value =
        copyStats.spawnTime.base * this.effect().current;

      return copyStats;
    },
    cost: function (discountMultiplier: number) {
      const base = 500;
      return this.level * base * discountMultiplier;
    },
  },
];
