import { v4 } from "uuid";

import { imgCommand } from "assets";
import { IGitCommand } from "types/gameDataInterfaces";
import { GitCommandType } from "types/enums";
import { gitCommandBalancing } from "./balancing";

export const defaultGitCommands: IGitCommand[] = [
  {
    id: v4(),
    image: imgCommand,
    name: function () {
      return "git clone";
    },
    description: function () {
      return "Copy and download an remote repository to your local machine.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(gitCommandBalancing.clone.cost * discountMultiplier);
    },
    useCase:
      "Use %git clone% to set up a local copy of a remote repository. This allows you to have a local copy of a remote repository so you can work on it and make changes without affecting the original repository.",
    unlocked: true,
    unlockDay: gitCommandBalancing.clone.unlockDay,
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
      return "Downloads changes in branches from the remote.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(gitCommandBalancing.fetch.cost * discountMultiplier);
    },
    useCase:
      "Use %git fetch% command to retrieve the latest changes made by other contributors in the shared remote repository.",
    unlocked: true,
    unlockDay: gitCommandBalancing.fetch.unlockDay,
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
      return "Switch to another branch and check it out into your working directory.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(gitCommandBalancing.checkout.cost * discountMultiplier);
    },
    useCase:
      "Use %git checkout <BRANCH>% to switch to a specific branch in your local repository. Changes made in one branch does not affect other branches, meaning that you can work on new features in isolation.\n\n Use %git checkout -b <BRANCH>%  to create a new branch based on the current branch.",
    unlocked: true,
    unlockDay: gitCommandBalancing.checkout.unlockDay,
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
      return Math.round(gitCommandBalancing.add.cost * discountMultiplier);
    },
    useCase:
      "Use %git add <FILE_PATH>% to add and prepare a modified file to be committed later.\n\n Use %git add .% to add all modified files.",
    unlocked: true,
    unlockDay: gitCommandBalancing.add.unlockDay,
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
      return "Saves a snapshot of the staged changes in the local repository, creating a new commit in the project's history.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(gitCommandBalancing.commit.cost * discountMultiplier);
    },
    useCase:
      "Use %git commit -m <message>% to capture and preserve the changes made to the files in the repository. This creates a new commit in the commit history, allowing you to keep track of the evolution of the codebase and easily revert to previous versions if necessary.",
    unlocked: true,
    unlockDay: gitCommandBalancing.commit.unlockDay,
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
      return "Transfer committed changes from the local repository to the remote repository.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(gitCommandBalancing.push.cost * discountMultiplier);
    },
    useCase:
      "Use %git push% or %git push origin <BRANCH>% to transfer your local changes in a branch to a branch in the remote repository. This allows for other people to work with and see the changes you have made. If no branch name is provided in the command, the branch you are currently in will be used.",
    unlocked: true,
    unlockDay: gitCommandBalancing.push.unlockDay,
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
      return "Shows modified items in working directory, and staged items in the staging area.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(gitCommandBalancing.status.cost * discountMultiplier);
    },
    useCase:
      "Use %git status% to display the current state of the working directory and the staging area, indicating which files have been modified, staged for commit, or remain unmodified.",
    unlocked: true,
    unlockDay: gitCommandBalancing.status.unlockDay,
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
      return "List up existing branches.";
    },
    cost: function (discountMultiplier: number) {
      return Math.round(gitCommandBalancing.branch.cost * discountMultiplier);
    },
    useCase:
      "Use %git branch% to list existing branches; the current branch will be marked with an asterisk.\n\n Use %git branch -r% to show remote branches.",
    unlocked: false,
    unlockDay: gitCommandBalancing.branch.unlockDay,
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
      return Math.round(gitCommandBalancing.restore.cost * discountMultiplier);
    },
    useCase:
      "Use %git restore <FILE_PATH>% to recover changes in the working directory to their previous state, or recover files that were deleted from the repository. Use %git restore .% to restore all files. \n\n Use %git restore —staged <FILE_PATH>% to unstage changes in the staging area. Use %git restore —staged .% to unstage all changes in the staging area.",
    unlocked: false,
    unlockDay: gitCommandBalancing.restore.unlockDay,
    purchased: false,
    gitCommandType: GitCommandType.RESTORE,
  },
];
