import { gitHelper } from "services/gitHelper";
import { ICommandArg } from "types/interfaces";
import { IBranch, Item } from "types/gameDataInterfaces";
import { gitCommandDoesNotExist, gitRes } from "services/git";

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
          const branches = gameData.gitBranches;
          const activeBranch = gameData.gitActiveBranch;

          if (typeof branchName !== "string")
            return gitRes(`Error: '${branchName} is invalid'`, false);

          if (gitHelper.branchIsActive(branchName, activeBranch, branches))
            return gitRes(`Error: already on ${branchName}`, false);

          if (
            gameData.gitStagedItems.length > 0 ||
            gameData.gitModifiedItems.length > 0
          )
            return gitRes(
              "Error: please add/commit, or undo your changes to checkout",
              false
            );

          const newBranch = gitHelper.getBranch(branchName, branches);
          if (!newBranch)
            return gitRes(`Error: '${branchName} does not exist'`, false);

          setGameData({
            ...gameData,
            gitActiveBranch: newBranch,
            directory: newBranch.directory,
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
              const branches = gameData.gitBranches;

              if (typeof branchName !== "string")
                return gitRes(`Error: '${branchName} is an invalid'`, false);

              if (gitHelper.branchNameExists(branchName, branches))
                return gitRes(`Error: '${branchName} already exist'`, false);

              const newBranch: IBranch = {
                name: branchName,
                commits: gameData.gitActiveBranch.commits,
                directory: gameData.directory,
              };
              let copyBranches = gameData.gitBranches;
              copyBranches.push(newBranch);

              setGameData({ ...gameData, gitActiveBranch: newBranch });

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
            gameData.gitModifiedItems
          );

          if (!itemToStage)
            return gitRes(`Error: '${path}' did not match any files`, false);

          const newStagedItems = gameData.gitStagedItems;

          gitHelper.updateExistingOrAddNew(itemToStage, newStagedItems);

          const newModifiedItems = gameData.gitModifiedItems.filter(
            (item) => item.path !== path
          );

          setGameData({
            ...gameData,
            gitStagedItems: newStagedItems,
            gitModifiedItems: newModifiedItems,
          });

          return gitRes(`Added '${path}'`, true);
        },
      },
      {
        key: ".",
        args: [],
        cmd: (gameData, setGameData) => {
          if (gameData.gitModifiedItems.length === 0)
            return gitRes("Error: No files have been modified", false);

          const newStagedItems = gameData.gitStagedItems;

          gameData.gitModifiedItems.forEach((modifiedItem) =>
            gitHelper.updateExistingOrAddNew(modifiedItem, newStagedItems)
          );

          setGameData({
            ...gameData,
            gitStagedItems: newStagedItems,
            gitModifiedItems: [],
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

              if (gameData.gitStagedItems.length === 0)
                return gitRes("Error: nothing to commit", false);

              const { updatedActiveBranch, updatedBranches } =
                gitHelper.getUpdatedBranches(
                  gameData.gitActiveBranch,
                  gameData.gitBranches,
                  gameData.directory,
                  message
                );

              setGameData({
                ...gameData,
                gitActiveBranch: updatedActiveBranch,
                gitBranches: updatedBranches,
                gitStagedItems: [],
              });

              return gitRes(
                `${gameData.gitStagedItems.length} items commited`,
                true
              );
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
      for (let i = 0; i < gameData.gitStagedItems.length; i++) {
        status += `\t added: \t\t${gameData.gitStagedItems[i].path}\n`;
      }
      for (let i = 0; i < gameData.gitModifiedItems.length; i++) {
        status += `\t modified: \t${gameData.gitModifiedItems[i].path}\n`;
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
            gameData.gitModifiedItems
          );

          if (!itemToRestore)
            return gitRes(`Error: '${path}' did not match any files`, false);

          const newModifiedItems = gameData.gitModifiedItems.filter(
            (item) => item.path !== path
          );

          setGameData({
            ...gameData,
            gitModifiedItems: newModifiedItems,
          });

          return gitRes(`Restored '${path}'`, true);
        },
      },
      {
        key: ".",
        args: [],
        cmd: (gameData, setGameData) => {
          setGameData({
            ...gameData,
            directory: gameData.gitActiveBranch.directory,
            gitModifiedItems: [],
          });
          return gitRes("Restored modified files", true);
        },
      },
    ],
    cmd: () => gitRes("Error: no path specified", false),
  },
];
