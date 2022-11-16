import { IBranch, IGitTree } from "types/gitInterfaces";
import { gitHelper } from "services/gitHelper";
import { ICommandArg } from "types/interfaces";
import { Item } from "types/gameDataInterfaces";
import { gitCommandDoesNotExist, gitRes } from "services/git";
import { copyObjectWithoutRef, isOrderItem } from "services/helpers";
import { getIndexOfOrderItem } from "./gameDataHelper";

export const successMessages = {
  gitInitialized: "Initialized empty Git repository in <PATH>/.git/",
  gitAddNonModifiedFile: "",
};

export const errorMessages = {
  gitCommandDoesNotExist: "git: '<CMD>' is not a git command.",
  gitNotFound:
    "fatal: not a git repository (or any of the parent directories): .git",
  gitAddNoFolderOrFile: "Nothing specified, nothing added.",
  gitCheckoutUnknownBranch:
    "error: pathspec '<BRANCH>' did not match any file(s) known to git",
  gitBranchAlreadyExists: "fatal: A branch named '<BRANCH>' already exists.",
  gitAddNonExistentFile: "fatal: pathspec '<PATH>' did not match any files",
  gitCommitWithCleanTree: "nothing to commit, working tree clean",
  gitCheckoutBWithNoValue: "error: switch `b' requires a value",
};

export const gitCommands: ICommandArg[] = [
  {
    key: "cheat",
    args: [
      {
        key: "cash",
        args: [
          {
            key: "<AMOUNT>",
            isDynamic: true,
            args: [],
            cmd: (gameData, setGameData, amount) => {
              const money: number = Number(amount);
              if (!Number.isNaN(money))
                setGameData({ ...gameData, cash: money });
              else return gitRes(`Error: '${amount}' is not a number`, false);
              return gitRes(`${amount} added to your account`, true);
            },
          },
        ],
        cmd: () => gitCommandDoesNotExist(),
      },
      {
        key: "clear",
        args: [],
        cmd: () => {
          localStorage.removeItem("git-cooking");
          localStorage.removeItem("git-cooking-time");
          return gitRes("Removed localstorage. Please refresh page...", true);
        },
      },
    ],
    cmd: () => gitCommandDoesNotExist(),
  },
  {
    key: "checkout",
    args: [
      {
        key: "<BRANCH_NAME>",
        isDynamic: true,
        args: [],
        cmd: (gameData, setGameData, branchName) => {
          const branches = gameData.git.branches;

          if (typeof branchName !== "string")
            return gitRes(`Error: '${branchName} is invalid'`, false);

          if (gitHelper.branchIsActive(branchName, gameData.git.HEAD))
            return gitRes(`Error: already on ${branchName}`, false);

          if (
            gameData.git.stagedItems.length > 0 ||
            gameData.git.modifiedItems.length > 0
          )
            return gitRes(
              "Error: please add/commit, or undo your changes to checkout",
              false
            );

          const newBranch = gitHelper.getBranch(branchName, branches);
          if (!newBranch)
            return gitRes(`Error: '${branchName} does not exist'`, false);

          let copyGit = gameData.git;
          copyGit.HEAD.targetId = newBranch.name;
          setGameData({
            ...gameData,
            git: copyGit,
          });

          return gitRes(`Switched to branch '${branchName}'`, true);
        },
      },
      {
        key: "-b",
        args: [
          {
            key: "<BRANCH_NAME>",
            isDynamic: true,
            args: [],
            cmd: (gameData, setGameData, branchName) => {
              const branches = gameData.git.branches;

              if (typeof branchName !== "string")
                return gitRes(`Error: '${branchName} is an invalid'`, false);

              if (gitHelper.branchNameExists(branchName, branches))
                return gitRes(`Error: '${branchName} already exist'`, false);

              const newBranch: IBranch = {
                name: branchName,
                targetCommitId: gitHelper.getHeadCommitId(
                  gameData.git.HEAD,
                  branches
                ),
              };
              let copyGit = gameData.git;

              // add new branch to gitTree
              copyGit.branches.push(newBranch);

              // update HEAD to point at new branch
              copyGit.HEAD.targetId = newBranch.name;

              setGameData({ ...gameData, git: copyGit });

              return gitRes(`Switched to a new branch '${branchName}'`, true);
            },
          },
        ],
        cmd: () => gitRes("Error: switch 'b' requires a value", false),
      },
    ],
    cmd: () => gitRes("Error: no branch was provided to checkout", false),
  },
  {
    key: "add",
    args: [
      {
        key: "<PATH>",
        isDynamic: true,
        args: [],
        cmd: (gameData, setGameData, path) => {
          if (typeof path !== "string")
            return gitRes(`Error: '${path} is invalid'`, false);

          let itemToStage: Item | null = gitHelper.getModifiedFile(
            path,
            gameData.git.modifiedItems
          );

          if (!itemToStage)
            return gitRes(`Error: '${path}' did not match any files`, false);

          const newStagedItems = gameData.git.stagedItems;

          gitHelper.updateExistingOrAddNew(itemToStage, newStagedItems);

          const newModifiedItems = gameData.git.modifiedItems.filter(
            (item) => item.path !== path
          );

          setGameData({
            ...gameData,
            git: {
              ...gameData.git,
              stagedItems: copyObjectWithoutRef(newStagedItems),
              modifiedItems: newModifiedItems,
            },
          });

          return gitRes(`Added '${path}'`, true);
        },
      },
      {
        key: ".",
        args: [],
        cmd: (gameData, setGameData) => {
          if (gameData.git.modifiedItems.length === 0)
            return gitRes("Error: No files have been modified", false);

          const newStagedItems = gameData.git.stagedItems;

          gameData.git.modifiedItems.forEach((modifiedItem) =>
            gitHelper.updateExistingOrAddNew(modifiedItem, newStagedItems)
          );

          setGameData({
            ...gameData,
            git: {
              ...gameData.git,
              stagedItems: copyObjectWithoutRef(newStagedItems),
              modifiedItems: [],
            },
          });

          return gitRes(`Added all files`, true);
        },
      },
    ],
    cmd: () => gitRes("Error: no path specified", false),
  },
  {
    key: "commit",
    args: [
      {
        key: "-m",
        args: [
          {
            key: "<MESSAGE>",
            isDynamic: true,
            args: [],
            cmd: (gameData, setGameData, message) => {
              if (typeof message !== "string")
                return gitRes(`Error: ${message} is invalid`, false);

              if (gameData.git.stagedItems.length === 0)
                return gitRes("Error: nothing to commit", false);

              const nrItemsToCommit = gameData.git.stagedItems.length;
              const updatedGit = gitHelper.updateGitTreeWithNewCommit(
                gameData.git,
                message
              );

              setGameData({
                ...gameData,
                git: updatedGit,
              });

              return gitRes(`${nrItemsToCommit} items commited`, true);
            },
          },
        ],
        cmd: () => gitRes("Error: switch 'm' requires a value", false),
      },
    ],
    cmd: () => gitRes("", false),
  },
  {
    key: "status",
    args: [],
    cmd: (gameData) => {
      let status = "";
      status += `On branch ${gameData.git.HEAD.targetId}\n`;
      for (let i = 0; i < gameData.git.stagedItems.length; i++) {
        status += `\t added: \t\t${gameData.git.stagedItems[i].path}\n`;
      }
      for (let i = 0; i < gameData.git.modifiedItems.length; i++) {
        status += `\t modified: \t${gameData.git.modifiedItems[i].path}\n`;
      }
      if (status) return gitRes(status, true);
      else return gitRes("Nothing to commit, working tree clean", true);
    },
  },
  {
    key: "restore",
    args: [
      {
        key: "<PATH>",
        isDynamic: true,
        args: [],
        cmd: (gameData, setGameData, path) => {
          if (typeof path !== "string")
            return gitRes(`Error: '${path} is invalid'`, false);

          let itemToRestore: Item | null = gitHelper.getModifiedFile(
            path,
            gameData.git.modifiedItems
          );

          if (!itemToRestore)
            return gitRes(`Error: '${path}' did not match any files`, false);

          const newModifiedItems = gameData.git.modifiedItems.filter(
            (item) => item.path !== path
          );

          let copyGit: IGitTree = copyObjectWithoutRef(gameData.git);

          const activeCommitId = gitHelper.getHeadCommitId(
            copyGit.HEAD,
            copyGit.branches
          );

          const activeCommit = copyGit.commits.find(
            (c) => c.id === activeCommitId
          );

          const restoredItem = activeCommit?.directory.orders
            .find((o) => {
              if (isOrderItem(itemToRestore))
                return o.id === itemToRestore.orderId;
            })
            ?.items.find((i) => {
              if (isOrderItem(itemToRestore)) return i.id === itemToRestore.id;
            });

          if (restoredItem) {
            const relatedOrderIndex = copyGit.workingDirectory.orders.findIndex(
              (o) => {
                if (isOrderItem(itemToRestore))
                  return o.id === itemToRestore.orderId;
              }
            );
            if (isOrderItem(itemToRestore)) {
              const itemToRestoreIndex = getIndexOfOrderItem(
                copyGit.workingDirectory.orders[relatedOrderIndex],
                itemToRestore
              );

              copyGit.workingDirectory.orders[relatedOrderIndex].items[
                itemToRestoreIndex
              ] = restoredItem;
            }
          }

          copyGit.modifiedItems = newModifiedItems;
          setGameData({
            ...gameData,
            git: copyGit,
          });

          return gitRes(`Restored '${path}'`, true);
        },
      },
      {
        key: ".",
        args: [],
        cmd: (gameData, setGameData) => {
          const activeCommitId = gitHelper.getHeadCommitId(
            gameData.git.HEAD,
            gameData.git.branches
          );

          const activeCommit = gameData.git.commits.find(
            (c) => c.id === activeCommitId
          );

          if (activeCommit)
            setGameData({
              ...gameData,
              git: {
                ...gameData.git,
                workingDirectory: activeCommit.directory,
                modifiedItems: [],
              },
            });
          return gitRes("Restored modified files", true);
        },
      },
    ],
    cmd: () => gitRes("Error: no path specified", false),
  },
];
