import { v4 } from "uuid";

import { imgCommand } from "assets";
import { IGitCommand } from "types/gameDataInterfaces";
import { GitCommandType } from "types/enums";

export const defaultGitCommands: IGitCommand[] = [
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git restore";
    },
    description: function () {
      return "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(1250 * discountMultiplier);
    },
    unlocked: false,
    unlockDay: 2,
    purchased: false,
    gitCommandType: GitCommandType.RESTORE,
  },
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git branch";
    },
    description: function () {
      return "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(2250 * discountMultiplier);
    },
    unlocked: false,
    unlockDay: 5,
    purchased: false,
    gitCommandType: GitCommandType.BRANCH,
  },
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git checkout";
    },
    description: function () {
      return "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(3250 * discountMultiplier);
    },
    unlocked: false,
    unlockDay: 10,
    purchased: false,
    gitCommandType: GitCommandType.CHECKOUT,
  },
];
