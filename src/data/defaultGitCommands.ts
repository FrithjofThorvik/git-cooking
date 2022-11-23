import { v4 } from "uuid";

import { imgCommand } from "assets";
import { IGitCommand } from "types/gameDataInterfaces";
import { GitCommandType } from "types/enums";

export const defaultGitCommands: IGitCommand[] = [
  {
    id: v4(),
    image: imgCommand,
    name: "git restore",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    cost: 1250,
    unlocked: true,
    purchased: false,
    gitCommandType: GitCommandType.RESTORE,
  },
  {
    id: v4(),
    image: imgCommand,
    name: "git branch",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    cost: 2250,
    unlocked: true,
    purchased: false,
    gitCommandType: GitCommandType.BRANCH,
  },
  {
    id: v4(),
    image: imgCommand,
    name: "git checkout",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    cost: 3250,
    unlocked: false,
    purchased: false,
    gitCommandType: GitCommandType.CHECKOUT,
  },
];
