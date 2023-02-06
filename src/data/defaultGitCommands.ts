import { v4 } from "uuid";

import { imgCommand } from "assets";
import { IGitCommand } from "types/gameDataInterfaces";
import { GitCommandType } from "types/enums";

export const defaultGitCommands: IGitCommand[] = [
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git clone";
    },
    description: function () {
      return "Clones project to your computer";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(3250 * discountMultiplier);
    },
    useCase: "",
    unlocked: true,
    unlockDay: 0,
    purchased: true,
    gitCommandType: GitCommandType.CLONE,
  },
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git fetch";
    },
    description: function () {
      return "Fetch down branches from the remote.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(3250 * discountMultiplier);
    },
    useCase:
      "The %git fetch% command fetches all changes made online from others in the same git project as you.",
    unlocked: true,
    unlockDay: 0,
    purchased: true,
    gitCommandType: GitCommandType.FETCH,
  },
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git checkout";
    },
    description: function () {
      return "Switch to another branch and check it out into your working directory";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(3250 * discountMultiplier);
    },
    useCase:
      "%git checkout <BRANCH>% moves you to the respective branch you provide, so you can work in that environment.",
    unlocked: true,
    unlockDay: 0,
    purchased: true,
    gitCommandType: GitCommandType.CHECKOUT,
  },
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git add";
    },
    description: function () {
      return "Adds your modified items to the staging area.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(3250 * discountMultiplier);
    },
    useCase:
      "Use %git add <FILE_PATH>% to add and prepare a changed file to be commited later, or %git add .% to add all changed files.",
    unlocked: true,
    unlockDay: 0,
    purchased: true,
    gitCommandType: GitCommandType.ADD,
  },
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git commit";
    },
    description: function () {
      return "Commit your staged items, and deliver them the customer.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(3250 * discountMultiplier);
    },
    useCase: "",
    unlocked: true,
    unlockDay: 0,
    purchased: true,
    gitCommandType: GitCommandType.COMMIT,
  },
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git push";
    },
    description: function () {
      return "Push local branch commits to the remote repository branch";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(3250 * discountMultiplier);
    },
    useCase:
      "%git push% or %git push origin <BRANCH>% saves all the changes that has been commited. If no branch name is provided in the command, the branch you are currently in will be used.",
    unlocked: true,
    unlockDay: 0,
    purchased: true,
    gitCommandType: GitCommandType.PUSH,
  },
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git status";
    },
    description: function () {
      return "Show modified items in working directory, and staged items for your next commit";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(3250 * discountMultiplier);
    },
    useCase: "",
    unlocked: true,
    unlockDay: 0,
    purchased: true,
    gitCommandType: GitCommandType.STATUS,
  },
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git branch";
    },
    description: function () {
      return "Use 'git branch' to list up local branches.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(2250 * discountMultiplier);
    },
    useCase: "",
    unlocked: false,
    unlockDay: 2,
    purchased: false,
    gitCommandType: GitCommandType.BRANCH,
  },
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git restore";
    },
    description: function () {
      return "The restore command is used to discard uncommitted changes.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(1250 * discountMultiplier);
    },
    useCase: "",
    unlocked: false,
    unlockDay: 4,
    purchased: false,
    gitCommandType: GitCommandType.RESTORE,
  },
];
