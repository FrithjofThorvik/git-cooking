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
    cost: function () {
      return 1250;
    },
    unlocked: true,
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
    cost: function () {
      return 2250;
    },
    unlocked: true,
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
    cost: function () {
      return 3250;
    },
    unlocked: false,
    purchased: false,
    gitCommandType: GitCommandType.CHECKOUT,
  },
];
