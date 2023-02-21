export const upgradeBalancing = {
  discount: {
    unlockDay: 4,
    baseCost: 100,
    effect: function (level: number) {
      return 1.16 - 0.16 * level;
    },
    cost: function (level: number) {
      return this.baseCost * Math.exp(level - 1);
    },
  },
  costReduction: {
    unlockDay: 3,
    baseCost: 100,
    effect: function (level: number) {
      return 1.12 - 0.12 * level;
    },
    cost: function (level: number) {
      return this.baseCost * Math.exp(level - 1);
    },
  },
  revenueMultiplier: {
    unlockDay: 7,
    baseCost: 100,
    effect: function (level: number) {
      return Math.exp((8 * level - 8) / 20);
    },
    cost: function (level: number) {
      return this.baseCost * Math.exp(level - 1);
    },
  },
  spawnTime: {
    unlockDay: 1,
    baseCost: 100,
    effect: function (level: number) {
      return Math.exp(-(level - 1) / 2);
    },
    cost: function (level: number) {
      return this.baseCost * Math.exp(level - 1);
    },
  },
  dayLength: {
    unlockDay: 6,
    baseCost: 100,
    effect: function (level: number) {
      return Math.exp((level - 1) / 7);
    },
    cost: function (level: number) {
      return this.baseCost * Math.exp(level - 1);
    },
  },
};

export const foodBalancing = {
  bunTop: {
    unlockDay: 0,
    useCost: 10,
    cost: 0,
  },
  paddy: {
    unlockDay: 0,
    useCost: 10,
    cost: 0,
  },
  bunBottom: {
    unlockDay: 0,
    useCost: 10,
    cost: 0,
  },
  fries: {
    unlockDay: 0,
    useCost: 8,
    cost: 0,
  },
  salad: {
    unlockDay: 1,
    useCost: 12,
    cost: 100,
  },
  cheeseFries: {
    unlockDay: 3,
    useCost: 12,
    cost: 100,
  },
  onions: {
    unlockDay: 4,
    useCost: 12,
    cost: 100,
  },
  tomato: {
    unlockDay: 5,
    useCost: 12,
    cost: 100,
  },
  onionRings: {
    unlockDay: 8,
    useCost: 12,
    cost: 100,
  },
  bacon: {
    unlockDay: 7,
    useCost: 12,
    cost: 100,
  },
  nachos: {
    unlockDay: 9,
    useCost: 12,
    cost: 100,
  },
};

export const gitCommandBalancing = {
  branch: { unlockDay: 1, cost: 50 },
  restore: { unlockDay: 2, cost: 100 },
  clone: { unlockDay: 0, cost: 0 },
  fetch: { unlockDay: 0, cost: 0 },
  checkout: { unlockDay: 0, cost: 0 },
  add: { unlockDay: 0, cost: 0 },
  commit: { unlockDay: 0, cost: 0 },
  push: { unlockDay: 0, cost: 0 },
  status: { unlockDay: 0, cost: 0 },
};
