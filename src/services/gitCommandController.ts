import { Item } from "types/gameDataInterfaces";
import { ICommandArg } from "types/interfaces";
import { IBranch, IGitTree } from "types/gitInterfaces";
import { getIndexOfOrderItem } from "./gameDataHelper";
import { gitCommandDoesNotExist, gitRes } from "services/git";
import { copyObjectWithoutRef, isOrderItem } from "services/helpers";

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
          if (typeof branchName !== "string")
            return gitRes(`Error: '${branchName} is invalid'`, false);

          if (gameData.git.branchIsActive(branchName))
            return gitRes(`Error: already on ${branchName}`, false);

          if (
            gameData.git.stagedItems.length > 0 ||
            gameData.git.modifiedItems.length > 0
          )
            return gitRes(
              "Error: please add/commit, or undo your changes to checkout",
              false
            );

          const newBranch = gameData.git.getBranch(branchName);
          if (!newBranch)
            return gitRes(`Error: '${branchName} does not exist'`, false);

          // switch branch
          const copyGit = gameData.git.getGitTreeWithSwitchedBranch(
            newBranch.name
          );

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
              if (typeof branchName !== "string")
                return gitRes(`Error: '${branchName} is an invalid'`, false);

              if (gameData.git.branchNameExists(branchName))
                return gitRes(`Error: '${branchName} already exist'`, false);

              const activeCommit = gameData.git.getHeadCommit();
              if (activeCommit) {
                const newBranch: IBranch = {
                  name: branchName,
                  targetCommitId: activeCommit.id,
                };
                let copyGit = gameData.git;

                // add new branch to gitTree
                copyGit.branches.push(newBranch);

                // switch branch
                copyGit = copyGit.getGitTreeWithSwitchedBranch(newBranch.name);

                setGameData({ ...gameData, git: copyGit });
              }

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

          let itemToStage: Item | null = gameData.git.getModifiedFile(path);

          if (!itemToStage)
            return gitRes(`Error: '${path}' did not match any files`, false);

          const newStagedItems = gameData.git.stagedItems;

          gameData.git.updateExistingOrAddNew(itemToStage, newStagedItems);

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
            gameData.git.updateExistingOrAddNew(modifiedItem, newStagedItems)
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
              const updatedGit = gameData.git.getGitTreeWithNewCommit(message);

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

          let itemToRestore: Item | null = gameData.git.getModifiedFile(path);

          if (!itemToRestore)
            return gitRes(`Error: '${path}' did not match any files`, false);

          const newModifiedItems = gameData.git.modifiedItems.filter(
            (item) => item.path !== path
          );

          let copyGit: IGitTree = copyObjectWithoutRef(gameData.git);

          const activeCommit = copyGit.getHeadCommit();

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
          const activeCommit = gameData.git.getHeadCommit();

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
