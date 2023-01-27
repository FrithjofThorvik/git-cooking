import { GameState, GitCommandType } from "types/enums";
import { ICommandArg, IGitResponse } from "types/interfaces";
import { IGitCooking, IOrderItem } from "types/gameDataInterfaces";
import { copyObjectWithoutRef } from "./helpers";
import { gitCommandDoesNotExist, gitRes } from "services/git";
import { isGitCmdPurchased } from "./gameDataHelper";
import { defaultItemData } from "data/defaultItemData";

const middleware = (
  gameData: IGitCooking,
  gitCommandType: GitCommandType,
  next: () => IGitResponse
) => {
  if (!isGitCmdPurchased(gameData.store.gitCommands, gitCommandType))
    return gitRes(`Error: 'git ${gitCommandType}' is not purchased`, false);
  return next();
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
                setGameData({
                  ...gameData,
                  store: { ...gameData.store, cash: money },
                });
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
          location.reload();
          return gitRes("Removed localstorage. Please refresh page...", true);
        },
      },
      {
        key: "end-day",
        args: [],
        cmd: (gameData, setGameData, input, timeLapsed) => {
          if (timeLapsed === undefined)
            return gitRes("Error: timelapsed undefined", false);
          let updatedGameData = gameData.endDay(timeLapsed);

          setGameData({
            ...updatedGameData,
          });
          return gitRes("Ended day", true);
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
          return middleware(gameData, GitCommandType.CHECKOUT, () => {
            if (typeof branchName !== "string")
              return gitRes(`Error: '${branchName} is invalid'`, false);

            if (gameData.git.isBranchActive(branchName))
              return gitRes(`Error: already on ${branchName}`, false);

            if (
              gameData.git.stagedItems.length > 0 ||
              gameData.git.modifiedItems.length > 0
            )
              return gitRes(
                "Error: please add/commit, or undo your changes to checkout",
                false
              );

            const localBranch = gameData.git.getBranch(branchName);
            const remoteBranch = gameData.git.getRemoteBranch(branchName);
            let copyGit = copyObjectWithoutRef(gameData.git);
            let updatedOrderService = gameData.orderService;

            if (!remoteBranch && !localBranch)
              return gitRes(`Error: '${branchName} does not exist'`, false);

            if (!localBranch && remoteBranch) {
              // create new branch that tracks remote
              copyGit = gameData.git.addNewBranch(
                branchName,
                remoteBranch.name
              );

              const activeBranch = copyGit.getActiveBranch();
              if (activeBranch)
                // switch branch for orders
                updatedOrderService = updatedOrderService.switchBranch(
                  activeBranch.name,
                  branchName
                );

              // update orders
              updatedOrderService = updatedOrderService.setNewOrders(
                remoteBranch.orders,
                branchName
              );

              // switch branch
              copyGit = copyGit.switchBranch(branchName);

              let newGameState = gameData.states.gameState;
              if (newGameState === GameState.FETCH)
                newGameState = GameState.WORKING;

              setGameData({
                ...gameData,
                itemInterface: copyObjectWithoutRef(defaultItemData),
                states: { ...gameData.states, gameState: newGameState },
                orderService: updatedOrderService,
                git: copyGit,
              });

              return gitRes(
                `Switched to branch '${branchName}'\n '${branchName}' set up to track 'origin/${branchName}'`,
                true
              );
            }

            const activeBranch = gameData.git.getActiveBranch();
            if (activeBranch)
              // switch branch for orders
              updatedOrderService = updatedOrderService.switchBranch(
                activeBranch.name,
                branchName
              );

            // switch branch
            copyGit = copyGit.switchBranch(branchName);

            setGameData({
              ...gameData,
              itemInterface: copyObjectWithoutRef(defaultItemData),
              orderService: updatedOrderService,
              git: copyGit,
            });

            return gitRes(`Switched to branch '${branchName}'`, true);
          });
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
              return middleware(gameData, GitCommandType.CHECKOUT, () => {
                if (typeof branchName !== "string")
                  return gitRes(`Error: '${branchName} is an invalid'`, false);

                if (gameData.git.doesBranchNameExists(branchName))
                  return gitRes(`Error: '${branchName} already exist'`, false);

                let copyGit = gameData.git.addNewBranch(branchName);

                // switch branch
                copyGit = copyGit.switchBranch(branchName);

                setGameData({ ...gameData, git: copyGit });

                return gitRes(`Switched to a new branch '${branchName}'`, true);
              });
            },
          },
        ],
        cmd: (gameData) => {
          return middleware(gameData, GitCommandType.CHECKOUT, () => {
            return gitRes("Error: switch 'b' requires a value", false);
          });
        },
      },
    ],
    cmd: (gameData) => {
      return middleware(gameData, GitCommandType.CHECKOUT, () => {
        return gitRes("Error: no branch was provided to checkout", false);
      });
    },
  },
  {
    key: "add",
    args: [
      {
        key: "<PATH>",
        isDynamic: true,
        args: [],
        cmd: (gameData, setGameData, path) => {
          return middleware(gameData, GitCommandType.ADD, () => {
            if (typeof path !== "string")
              return gitRes(`Error: '${path} is invalid'`, false);

            let itemToStage = gameData.git.getModifiedFile(path);

            if (!itemToStage)
              return gitRes(`Error: '${path}' did not match any files`, false);

            const updatedGitTree = gameData.git.stageItem(itemToStage);

            setGameData({
              ...gameData,
              git: updatedGitTree,
            });

            return gitRes(`Added '${path}'`, true);
          });
        },
      },
      {
        key: ".",
        args: [],
        cmd: (gameData, setGameData) => {
          return middleware(gameData, GitCommandType.ADD, () => {
            if (gameData.git.modifiedItems.length === 0)
              return gitRes("Error: No files have been modified", false);

            let updatedGitTree = gameData.git.stageAllItems();

            setGameData({
              ...gameData,
              git: updatedGitTree,
            });

            return gitRes(`Added all files`, true);
          });
        },
      },
    ],
    cmd: (gameData) => {
      return middleware(gameData, GitCommandType.ADD, () => {
        return gitRes("Error: no path specified", false);
      });
    },
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
              return middleware(gameData, GitCommandType.COMMIT, () => {
                if (typeof message !== "string")
                  return gitRes(`Error: ${message} is invalid`, false);

                if (gameData.git.stagedItems.length === 0)
                  return gitRes("Error: nothing to commit", false);

                const nrItemsToCommit = gameData.git.stagedItems.length;
                let updatedGit = gameData.git.commit(message);
                let updatedOrderService = gameData.orderService;
                const newCreatedItems =
                  updatedGit.getHeadCommit()?.directory.createdItems;

                if (newCreatedItems)
                  updatedOrderService =
                    updatedOrderService.updatePercentageCompleted(
                      newCreatedItems
                    );

                setGameData({
                  ...gameData,
                  git: updatedGit,
                  orderService: updatedOrderService,
                });

                return gitRes(`${nrItemsToCommit} items commited`, true);
              });
            },
          },
        ],
        cmd: (gameData) => {
          return middleware(gameData, GitCommandType.COMMIT, () => {
            return gitRes("Error: switch 'm' requires a value", false);
          });
        },
      },
    ],
    cmd: (gameData) => {
      return middleware(gameData, GitCommandType.COMMIT, () => {
        return gitRes("", false);
      });
    },
  },
  {
    key: "status",
    args: [],
    cmd: (gameData) => {
      return middleware(gameData, GitCommandType.STATUS, () => {
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
      });
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
          return middleware(gameData, GitCommandType.RESTORE, () => {
            if (typeof path !== "string")
              return gitRes(`Error: '${path} is invalid'`, false);

            let modifiedItem = gameData.git.getModifiedFile(path);
            let itemToRestore: IOrderItem | undefined = modifiedItem?.item;

            if (itemToRestore === undefined)
              return gitRes(`Error: '${path}' did not match any files`, false);

            if (modifiedItem) {
              let copyGit = gameData.git;

              copyGit = copyGit.restoreFile(modifiedItem);

              setGameData({
                ...gameData,
                git: copyGit,
              });
            }

            return gitRes(`Restored '${path}'`, true);
          });
        },
      },
      {
        key: ".",
        args: [],
        cmd: (gameData, setGameData) => {
          return middleware(gameData, GitCommandType.RESTORE, () => {
            const copyGit = gameData.git.restoreAllFiles();

            setGameData({
              ...gameData,
              git: copyGit,
            });
            return gitRes("Restored modified files", true);
          });
        },
      },
      {
        key: "--staged",
        args: [
          {
            key: "<PATH>",
            isDynamic: true,
            args: [],
            cmd: (gameData, setGameData, path) => {
              if (typeof path !== "string")
                return gitRes(`Error: '${path} is invalid'`, false);

              let stagedFile = gameData.git.getStagedFile(path);
              let itemToRestore: IOrderItem | undefined = stagedFile?.item;

              if (itemToRestore === undefined)
                return gitRes(
                  `Error: '${path}' did not match any files`,
                  false
                );

              if (stagedFile) {
                let copyGit = gameData.git;

                copyGit = copyGit.restoreStagedFile(stagedFile);

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
              const copyGit = gameData.git.restoreAllStagedFiles();

              setGameData({
                ...gameData,
                git: copyGit,
              });
              return gitRes("Restored staged files", true);
            },
          },
        ],
        cmd: (gameData) => {
          return middleware(gameData, GitCommandType.RESTORE, () => {
            return gitRes("Error: switch '--staged' requires a value", false);
          });
        },
      },
    ],
    cmd: (gameData) => {
      return middleware(gameData, GitCommandType.RESTORE, () => {
        return gitRes("Error: no path specified", false);
      });
    },
  },
  {
    key: "fetch",
    args: [],
    cmd: (gameData, setGameData) => {
      return middleware(gameData, GitCommandType.FETCH, () => {
        const { updatedGit, newBranches } = gameData.git.fetch();

        setGameData({ ...gameData, git: updatedGit });

        let message = "";
        for (let i = 0; i < newBranches.length; i++) {
          message += `* [new branch]\t${newBranches[i]}    \t-> origin/${newBranches[i]}\n`;
        }
        if (newBranches.length === 0) message = "No new changes";

        return gitRes(message, true);
      });
    },
  },
  {
    key: "push",
    args: [
      {
        key: "origin",
        args: [
          {
            key: "<PATH>",
            isDynamic: true,
            args: [],
            cmd: (gameData, setGameData, branchName) => {
              return middleware(gameData, GitCommandType.PUSH, () => {
                if (gameData.states.gameState !== GameState.WORKING)
                  return gitRes(
                    `Error: This command is currently disabled`,
                    false
                  );

                if (typeof branchName !== "string")
                  return gitRes(`Error: '${branchName} is invalid'`, false);

                const branch = gameData.git.getBranch(branchName);
                if (!branch)
                  return gitRes(`Error: '${branchName} does not exist'`, false);

                const createdItems = gameData.git.getCommitFromId(
                  branch.targetCommitId
                )?.directory.createdItems;

                let updatedGameData = gameData;

                if (createdItems && branch.remoteTrackingBranch)
                  updatedGameData.git.remote =
                    updatedGameData.git.remote.pushItems(
                      branch.remoteTrackingBranch,
                      createdItems,
                      updatedGameData.orderService.getAllOrders()
                    );

                setGameData(updatedGameData);

                return gitRes("Pushing added changes to remote", true);
              });
            },
          },
        ],
        cmd: (gameData) => {
          return middleware(gameData, GitCommandType.PUSH, () => {
            return gitRes("Error: no branch specified", false);
          });
        },
      },
    ],
    cmd: (gameData, setGameData) => {
      return middleware(gameData, GitCommandType.PUSH, () => {
        if (gameData.states.gameState !== GameState.WORKING)
          return gitRes(`Error: This command is currently disabled`, false);

        const activeBranch = gameData.git.getActiveBranch();
        if (!activeBranch?.remoteTrackingBranch)
          return gitRes("Error: no remote specified", false);

        const createdItems = gameData.git.getCommitFromId(
          activeBranch.targetCommitId
        )?.directory.createdItems;
        let updatedGameData = gameData;

        if (createdItems)
          updatedGameData.git.remote = updatedGameData.git.remote.pushItems(
            activeBranch.remoteTrackingBranch,
            createdItems,
            updatedGameData.orderService.getAllOrders()
          );

        setGameData(updatedGameData);

        return gitRes("Pushing added changes to remote", true);
      });
    },
  },
  {
    key: "branch",
    args: [
      {
        key: "-r",
        args: [],
        cmd: (gameData) => {
          return middleware(gameData, GitCommandType.BRANCH, () => {
            let message = "Remote branches:\n";
            gameData.git.remote.branches.forEach((b) => {
              message += `\torigin/${b.name}\n`;
            });
            return gitRes(message, true);
          });
        },
      },
    ],
    cmd: (gameData) => {
      return middleware(gameData, GitCommandType.BRANCH, () => {
        let message = "Local branches:\n";
        gameData.git.branches.forEach((b) => {
          const isActive = gameData.git.isBranchActive(b.name);
          message += `\t${isActive ? "* " : ""}${b.name}\n`;
        });
        return gitRes(message, true);
      });
    },
  },
];
