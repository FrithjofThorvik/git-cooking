import { GameState } from "types/enums";
import { ICommandArg } from "types/interfaces";
import { IOrderItem } from "types/gameDataInterfaces";
import { copyObjectWithoutRef } from "./helpers";
import { gitCommandDoesNotExist, gitRes } from "services/git";

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
        cmd: (gameData, setGameData) => {
          let updatedGameData = gameData.endDay();

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

          const newBranch = gameData.git.getBranch(branchName);
          if (!newBranch)
            return gitRes(`Error: '${branchName} does not exist'`, false);

          // switch branch
          const gitTreeWithSwitchedBranch = gameData.git.switchBranch(
            newBranch.name
          );

          setGameData({
            ...gameData,
            git: gitTreeWithSwitchedBranch,
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

              if (gameData.git.doesBranchNameExists(branchName))
                return gitRes(`Error: '${branchName} already exist'`, false);

              const gitTreeWithNewBranch =
                gameData.git.addNewBranch(branchName);

              setGameData({ ...gameData, git: gitTreeWithNewBranch });

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

          const updatedGitTree = gameData.git.stageItem(itemToStage);

          setGameData({
            ...gameData,
            git: updatedGitTree,
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

          let updatedGitTree = gameData.git.stageAllItems();

          setGameData({
            ...gameData,
            git: updatedGitTree,
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
        },
      },
      {
        key: ".",
        args: [],
        cmd: (gameData, setGameData) => {
          const copyGit = gameData.git.restoreAllFiles();

          setGameData({
            ...gameData,
            git: copyGit,
          });
          return gitRes("Restored modified files", true);
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
        cmd: () => gitRes("Error: switch '--staged' requires a value", false),
      },
    ],
    cmd: () => gitRes("Error: no path specified", false),
  },
  {
    key: "pull",
    args: [
      {
        key: "origin",
        args: [
          {
            key: "<PATH>",
            isDynamic: true,
            args: [],
            cmd: (gameData, setGameData, branchName) => {
              if (gameData.states.gameState != GameState.PULL)
                return gitRes(`Already up to date`, true);

              if (typeof branchName !== "string")
                return gitRes(`Error: '${branchName} is invalid'`, false);

              const pulledBranch = gameData.git.getRemoteBranch(branchName);
              if (!pulledBranch)
                return gitRes(`Error: '${branchName} does not exist'`, false);

              let newGameState: GameState = copyObjectWithoutRef(
                gameData.states.gameState
              );
              if (newGameState === GameState.PULL)
                newGameState = GameState.WORKING;

              const updatedOrderService = gameData.orderService.setNewOrders(
                pulledBranch.orders
              );

              const updatedStates = gameData.states.setGameState(newGameState);

              setGameData({
                ...gameData,
                states: updatedStates,
                orderService: updatedOrderService,
              });

              return gitRes(`Pulled remote branch: '${branchName}'`, true);
            },
          },
        ],
        cmd: (gameData) => {
          if (gameData.states.gameState != GameState.PULL)
            return gitRes(`Already up to date`, true);

          return gitRes("Error: no branch specified", false);
        },
      },
    ],
    cmd: (gameData) => {
      if (gameData.states.gameState != GameState.PULL)
        return gitRes(`Already up to date`, true);
      return gitRes("Error: no remote specified", false);
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
            cmd: (gameData, setGameData, branchName, timeLapsed) => {
              if (gameData.states.gameState !== GameState.WORKING)
                return gitRes(
                  `Error: This command is currently disabled`,
                  false
                );

              if (typeof branchName !== "string")
                return gitRes(`Error: '${branchName} is invalid'`, false);

              const branch = gameData.git.getRemoteBranch(branchName);
              if (!branch)
                return gitRes(`Error: '${branchName} does not exist'`, false);
              // TODO: Check if branch is active

              const updatedGameData = gameData.endDay(timeLapsed);

              setGameData(updatedGameData);

              return gitRes("Pushing added changes to remote", true);
            },
          },
        ],
        cmd: () => {
          return gitRes("Error: ", false);
        },
      },
    ],
    cmd: (gameData) => {
      return gitRes("Error: no remote specified", false);
    },
  },
  {
    key: "branch",
    args: [],
    cmd: (gameData) => {
      let branches = "";

      return gitRes("Hei", true);
    },
  },
];
