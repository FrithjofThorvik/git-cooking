import { ErrorType, GameState, GitCommandType } from "types/enums";
import { ICommandArg, IGitResponse } from "types/interfaces";
import { IGitCooking, IOrderItem } from "types/gameDataInterfaces";
import { copyObjectWithoutRef, objectsEqual } from "./helpers";
import { gitCommandDoesNotExist, gitRes } from "services/git";
import { isGitCmdPurchased } from "./gameDataHelper";
import { defaultItemData } from "data/defaultItemData";
import { IGitTree } from "types/gitInterfaces";
import { IProject } from "types/gitInterfaces";

const errorHandler = (response: IGitResponse) => {
  let returnResponse = response;
  if (response.success) return returnResponse;

  switch (response.errorType) {
    case ErrorType.WRONG_FILE_NAME:
      returnResponse.message +=
        "\n" +
        "%HINT%: Use 'git status' to see full path of modified and staged files.";
      return returnResponse;
    case ErrorType.WRONG_BRANCH_NAME:
      returnResponse.message +=
        "\n" +
        "%HINT%: Purchase 'git branch', and use 'git branch' or 'git branch -r' to see available branches.";
      return returnResponse;
    default:
      return returnResponse;
  }
};

const middleware = (
  gameData: IGitCooking,
  gitCommandType: GitCommandType,
  next: () => IGitResponse
) => {
  if (!isGitCmdPurchased(gameData.store.gitCommands, gitCommandType))
    return gitRes(`Error: 'git ${gitCommandType}' is not purchased`, false);

  return errorHandler(next());
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

          let updatedGameData = copyObjectWithoutRef(gameData);
          if (updatedGameData.states.gameState === GameState.FETCH)
            updatedGameData.states.day += 1;

          updatedGameData = updatedGameData.endDay(timeLapsed);

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
              return gitRes(`Error: '${branchName}' is invalid`, false);

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
            let copyGit: IGitTree = copyObjectWithoutRef(gameData.git);
            let updatedOrderService = gameData.orderService;

            if ((!remoteBranch && !localBranch) || !remoteBranch?.isFetched)
              return gitRes(
                `Error: '${branchName}' does not exist`,
                false,
                ErrorType.WRONG_BRANCH_NAME
              );

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

              // update commits
              copyGit
                .getActiveProject()
                ?.remote.getCommitHistory(remoteBranch.targetCommitId)
                .forEach((c) => {
                  if (copyGit.commits.some((c1) => c1.id === c.id)) return;
                  copyGit.commits.push(c);
                });

              // switch branch
              copyGit = copyGit.switchBranch(branchName);

              setGameData({
                ...gameData,
                itemInterface: copyObjectWithoutRef(defaultItemData),
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
                  return gitRes(`Error: '${branchName}' is an invalid`, false);

                if (gameData.git.doesBranchNameExists(branchName))
                  return gitRes(
                    `Error: '${branchName}' already exist`,
                    false,
                    ErrorType.WRONG_BRANCH_NAME
                  );

                let copyGit = gameData.git.addNewBranch(branchName);

                let copy: IGitCooking = copyObjectWithoutRef(gameData);
                // update orders
                copy.orderService = copy.orderService.setNewOrders(
                  [],
                  branchName
                );
                // switch branch for orders
                copy.orderService = copy.orderService.switchBranch(
                  branchName,
                  branchName
                );
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
              return gitRes(`Error: '${path}' is invalid`, false);

            let itemToStage = gameData.git.getModifiedFile(path);

            if (!itemToStage)
              return gitRes(
                `Error: '${path}' did not match any files`,
                false,
                ErrorType.WRONG_FILE_NAME
              );

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
                const currentBranch = gameData.git.getActiveBranch();

                if (newCreatedItems) {
                  updatedOrderService =
                    updatedOrderService.updatePercentageCompleted(
                      newCreatedItems
                    );
                  // also update the branch array in orderService!
                  updatedOrderService = updatedOrderService.setNewOrders(
                    updatedOrderService.getAllOrders(),
                    currentBranch?.name
                  );
                }

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

        const activeBranch = gameData.git.getActiveBranch();
        if (activeBranch) {
          const pushedItems = gameData.git
            .getActiveProject()
            ?.remote.getPushedItems(activeBranch.name);
          const createdItems = gameData.git.getCommitFromId(
            activeBranch.targetCommitId
          )?.directory.createdItems;
          if (
            createdItems &&
            activeBranch.remoteTrackingBranch &&
            pushedItems
          ) {
            if (!objectsEqual(pushedItems, createdItems)) {
              status += `You have unsynced changes between 'origin/${activeBranch.remoteTrackingBranch}' and '${activeBranch.name}'\n`;
            } else {
              status += `Your branch is up to date with 'origin/${activeBranch.remoteTrackingBranch}'\n`;
            }
          }
        }

        if (gameData.git.stagedItems.length != 0)
          status += `\nChanges to be committed: \n  (use "git restore --staged <file>..." to unstage)\n`;
        gameData.git.stagedItems.forEach((stagedItem) => {
          let prefix = "%modified%";
          if (stagedItem.added) prefix = "%added%";
          if (stagedItem.deleted) prefix = "%deleted%";
          status += `\t ${prefix}: \t${stagedItem.item.path}\n`;
        });

        const trackedItems = gameData.git.modifiedItems.filter((i) => !i.added);
        if (trackedItems.length != 0)
          status += `\nChanges not staged for commit: \n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n`;
        trackedItems.forEach((modifiedItem) => {
          let prefix = "%modified%";
          if (modifiedItem.deleted) prefix = "%deleted%";
          status += `\t ${prefix}: \t${modifiedItem.item.path}\n`;
        });

        const newItems = gameData.git.modifiedItems.filter((i) => i.added);
        if (newItems.length != 0)
          status += `\nUntracked files: \n  (use "git add <file>..." to include in what will be committed)\n`;
        newItems.forEach((newItem) => {
          let prefix = "%added%";
          status += `\t ${prefix}: \t${newItem.item.path}\n`;
        });

        if (
          gameData.git.stagedItems.length === 0 &&
          gameData.git.modifiedItems.length != 0
        )
          status +=
            "\nnothing added to commit but untracked files present (use 'git add' to track)";

        if (
          gameData.git.stagedItems.length === 0 &&
          gameData.git.modifiedItems.length === 0
        )
          status += "\nnothing to commit, working tree clean";

        return gitRes(status, true);
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
              return gitRes(`Error: '${path}' is invalid`, false);

            let modifiedItem = gameData.git.getModifiedFile(path);
            let itemToRestore: IOrderItem | undefined = modifiedItem?.item;

            if (itemToRestore === undefined)
              return gitRes(
                `Error: '${path}' did not match any files`,
                false,
                ErrorType.WRONG_FILE_NAME
              );

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
              return middleware(gameData, GitCommandType.RESTORE, () => {
                if (typeof path !== "string")
                  return gitRes(`Error: '${path}' is invalid`, false);

                let stagedFile = gameData.git.getStagedFile(path);
                let itemToRestore: IOrderItem | undefined = stagedFile?.item;

                if (itemToRestore === undefined)
                  return gitRes(
                    `Error: '${path}' did not match any files`,
                    false,
                    ErrorType.WRONG_FILE_NAME
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
              });
            },
          },
          {
            key: ".",
            args: [],
            cmd: (gameData, setGameData) => {
              return middleware(gameData, GitCommandType.RESTORE, () => {
                const copyGit = gameData.git.restoreAllStagedFiles();

                setGameData({
                  ...gameData,
                  git: copyGit,
                });
                return gitRes("Restored staged files", true);
              });
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
        if (!gameData.git.getActiveProject()?.cloned)
          return gitRes("Error: you must clone a project first", false);

        const { updatedGit, newBranches } = gameData.git.fetch();

        setGameData({ ...gameData, git: updatedGit });

        let message = "";
        for (let i = 0; i < newBranches.length; i++) {
          message += `* [new branch]\t${newBranches[i]}`;
          if (newBranches[i].length < 9) message += "\t";
          message += `\t-> origin/${newBranches[i]}\n`;
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
                  return gitRes(`Error: '${branchName}' is invalid`, false);

                const branch = gameData.git.getBranch(branchName);
                if (!branch)
                  return gitRes(
                    `Error: '${branchName}' does not exist`,
                    false,
                    ErrorType.WRONG_BRANCH_NAME
                  );

                let updatedGameData: IGitCooking =
                  copyObjectWithoutRef(gameData);
                let updatedRemote = null;

                if (branch.remoteTrackingBranch)
                  updatedRemote = updatedGameData.git
                    .getActiveProject()
                    ?.remote.pushItems(
                      branch.remoteTrackingBranch,
                      updatedGameData.git.getCommitHistory(
                        branch.targetCommitId
                      ),
                      updatedGameData.orderService.getAllOrders(branchName)
                    );

                if (updatedRemote !== null && updatedRemote !== undefined) {
                  updatedGameData.git.projects =
                    updatedGameData.git.setActiveProjectRemote(updatedRemote);
                  setGameData(updatedGameData);
                  return gitRes("Pushing added changes to remote", true);
                }

                return gitRes("Everything up-to-date", true);
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

        let updatedGameData: IGitCooking = copyObjectWithoutRef(gameData);

        let updatedRemote = null;
        if (activeBranch.remoteTrackingBranch)
          updatedRemote = updatedGameData.git
            .getActiveProject()
            ?.remote.pushItems(
              activeBranch.remoteTrackingBranch,
              updatedGameData.git.getCommitHistory(),
              updatedGameData.orderService.getAllOrders()
            );

        if (updatedRemote !== null && updatedRemote !== undefined) {
          updatedGameData.git.projects =
            updatedGameData.git.setActiveProjectRemote(updatedRemote);
          setGameData(updatedGameData);
          return gitRes("Pushing added changes to remote", true);
        }

        return gitRes("Everything up-to-date", true);
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
            const activeProject = gameData.git.getActiveProject();
            if (activeProject?.cloned) {
              activeProject.remote.branches.forEach((b) => {
                message += `\torigin/${b.name}\n`;
              });
            }
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
  {
    key: "clone",
    args: [
      {
        key: "<URL>",
        args: [],
        isDynamic: true,
        cmd: (gameData, setGameData, url) => {
          return middleware(gameData, GitCommandType.CLONE, () => {
            let project: IProject | null = null;
            for (let i = 0; i < gameData.git.projects.length; i++) {
              if (gameData.git.projects[i].url === url)
                project = gameData.git.projects[i];
            }

            if (!project)
              return gitRes("Error: Project URL does not exist", false);
            if (project.cloned)
              return gitRes("Error: Project has already been cloned", false);
            const copy: IGitCooking = copyObjectWithoutRef(gameData);
            const updatedGitTree = copy.git.cloneProject(project);

            const activeBranch = updatedGitTree.getActiveBranch();
            const activeRemoteBranch =
              activeBranch && updatedGitTree.getRemoteBranch(activeBranch.name);
            if (activeRemoteBranch) {
              // update orders
              copy.orderService = copy.orderService.setNewOrders(
                activeRemoteBranch.orders,
                activeRemoteBranch.name
              );
              // switch branch for orders
              copy.orderService = copy.orderService.switchBranch(
                activeRemoteBranch.name,
                activeRemoteBranch.name
              );
            }

            setGameData({ ...copy, git: updatedGitTree });

            return gitRes("", true);
          });
        },
      },
    ],
    cmd: (gameData) => {
      return middleware(gameData, GitCommandType.CLONE, () => {
        return gitRes("Error: Project URL is required for cloning", false);
      });
    },
  },
];
