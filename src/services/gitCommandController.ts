import { Item } from "types/gameDataInterfaces";
import { ICommandArg } from "types/interfaces";
import { IBranch, IGitTree, IModifiedItem } from "types/gitInterfaces";
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

          let itemToStage = gameData.git.getModifiedFile(path);

          if (!itemToStage)
            return gitRes(`Error: '${path}' did not match any files`, false);

          const newStagedItems = gameData.git.updateExistingOrAddNew(
            itemToStage,
            gameData.git.stagedItems
          );

          const newModifiedItems = gameData.git.modifiedItems.filter(
            (modifiedItem: IModifiedItem) => modifiedItem.item.path !== path
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

          let newStagedItems = gameData.git.stagedItems;

          gameData.git.modifiedItems.forEach(
            (modifiedItem: IModifiedItem) =>
              (newStagedItems = gameData.git.updateExistingOrAddNew(
                modifiedItem,
                copyObjectWithoutRef(newStagedItems)
              ))
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

      if (gameData.git.stagedItems.length != 0)
        status += `\nChanges to be committed: \n`;
      for (let i = 0; i < gameData.git.stagedItems.length; i++) {
        const stagedItem = gameData.git.stagedItems[i];
        let prefix = "modified";
        if (stagedItem.added) prefix = "added";
        if (stagedItem.deleted) prefix = "deleted";
        status += `\t ${prefix}: \t${stagedItem.item.path}\n`;
      }

      if (gameData.git.modifiedItems.length != 0)
        status += `\nChanges not staged for commit: \n`;
      for (let i = 0; i < gameData.git.modifiedItems.length; i++) {
        const modifiedItem = gameData.git.modifiedItems[i];
        let prefix = "modified";
        if (modifiedItem.added) prefix = "added";
        if (modifiedItem.deleted) prefix = "deleted";
        status += `\t ${prefix}: \t${modifiedItem.item.path}\n`;
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

          let modifiedItem = gameData.git.getModifiedFile(path);
          let itemToRestore: Item | undefined = modifiedItem?.item;

          if (itemToRestore === undefined)
            return gitRes(`Error: '${path}' did not match any files`, false);

          if (modifiedItem?.added) return gitRes(``, false);

          const restoredItem = gameData.git.getRestoredFile(itemToRestore);

          if (isOrderItem(itemToRestore) && isOrderItem(restoredItem)) {
            let copyGit = gameData.git;

            const relatedOrderIndex = copyGit.workingDirectory.orders.findIndex(
              (o) => {
                if (isOrderItem(itemToRestore))
                  return o.id === itemToRestore.orderId;
              }
            );

            if (modifiedItem?.deleted) {
              copyGit.workingDirectory.orders[relatedOrderIndex].items =
                copyGit.workingDirectory.orders[relatedOrderIndex].items.concat(
                  [restoredItem]
                );
            } else {
              const itemToRestoreIndex = getIndexOfOrderItem(
                copyGit.workingDirectory.orders[relatedOrderIndex],
                itemToRestore
              );

              copyGit.workingDirectory.orders[relatedOrderIndex].items[
                itemToRestoreIndex
              ] = restoredItem;
            }

            const newModifiedItems = copyGit.modifiedItems.filter(
              (modifiedItem: IModifiedItem) =>
                modifiedItem.item.path !== itemToRestore?.path
            );

            copyGit.modifiedItems = newModifiedItems;

            setGameData({
              ...gameData,
              git: copyGit,
            });
          }

          return gitRes(`Restored '${path}'`, true);
        },
      },
      {
        key: ".",
        args: [],
        cmd: (gameData, setGameData) => {
          let copyGit = gameData.git;

          copyGit.modifiedItems.forEach((modifiedItem) => {
            if (modifiedItem?.added) return;
            let itemToRestore = modifiedItem.item;

            const restored = copyGit.getRestoredFile(itemToRestore);
            const restoredItem = restored?.item;

            const relatedOrderIndex = copyGit.workingDirectory.orders.findIndex(
              (o) => {
                if (isOrderItem(itemToRestore))
                  return o.id === itemToRestore.orderId;
              }
            );
            if (restoredItem === undefined || restored?.deleted) {
              copyGit.workingDirectory.orders[relatedOrderIndex].items =
                copyGit.workingDirectory.orders[relatedOrderIndex].items.filter(
                  (i) => i.path !== itemToRestore.path
                );
            } else if (
              isOrderItem(itemToRestore) &&
              isOrderItem(restoredItem)
            ) {
              if (modifiedItem.deleted) {
                copyGit.workingDirectory.orders[relatedOrderIndex].items =
                  copyGit.workingDirectory.orders[
                    relatedOrderIndex
                  ].items.concat([restoredItem]);
              } else {
                const itemToRestoreIndex = getIndexOfOrderItem(
                  copyGit.workingDirectory.orders[relatedOrderIndex],
                  itemToRestore
                );

                copyGit.workingDirectory.orders[relatedOrderIndex].items[
                  itemToRestoreIndex
                ] = restoredItem;
              }
            }
            const newModifiedItems = copyGit.modifiedItems.filter(
              (modifiedItem: IModifiedItem) =>
                modifiedItem.item.path !== itemToRestore?.path
            );

            copyGit.modifiedItems = newModifiedItems;
          });

          setGameData({
            ...gameData,
            git: copyGit,
          });
          return gitRes("Restored modified files", true);
        },
      },
    ],
    cmd: () => gitRes("Error: no path specified", false),
  },
];
