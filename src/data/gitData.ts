import { gitCommandDoesNotExist, gitRes } from "services/git";
import { gitHelper } from "services/gitHelper";
import { IBranch, ICommit, IFile } from "types/gameDataInterfaces";
import { ICommandArg } from "types/interfaces";
import { v4 as uuidv4 } from "uuid";

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
            gameData.gitStagedFiles.length > 0 ||
            gameData.gitModifiedFiles.length > 0
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
              const activeBranch = gameData.gitActiveBranch;

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

          let fileToStage: IFile | null = gitHelper.getFileToStage(
            path,
            gameData.gitModifiedFiles
          );

          if (!fileToStage)
            return gitRes(`Error: '${path}' did not match any files`, false);

          const newStagedFiles = gameData.gitStagedFiles.concat([fileToStage]);
          const newModifiedFiles = gameData.gitModifiedFiles.filter(
            (file) => file.path !== path
          );

          setGameData({
            ...gameData,
            gitStagedFiles: newStagedFiles,
            gitModifiedFiles: newModifiedFiles,
          });

          return gitRes(`Added '${path}'`, true);
        },
      },
      {
        key: ".",
        args: [],
        cmd: (gameData, setGameData) => {
          if (gameData.gitModifiedFiles.length === 0)
            return gitRes("Error: No files have been modified", false);

          setGameData({
            ...gameData,
            gitStagedFiles: gameData.gitModifiedFiles,
            gitModifiedFiles: [],
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

              if (gameData.gitStagedFiles.length === 0)
                return gitRes("Error: nothing to commit", false);

              const { updatedActiveBranch, updatedBranches } =
                gitHelper.getUpdatedBranches(
                  gameData.gitActiveBranch,
                  gameData.gitBranches,
                  gameData.directory,
                  message
                );
              // commits.push(directory)
              setGameData({
                ...gameData,
                gitActiveBranch: updatedActiveBranch,
                gitBranches: updatedBranches,
                gitStagedFiles: [],
              });

              return gitRes(
                `${gameData.gitStagedFiles.length} files commited`,
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
];
