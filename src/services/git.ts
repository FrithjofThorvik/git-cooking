import { IGitCooking } from "types/gameDataInterfaces";
import { gitCommands } from "./gitCommandController";
import { ICommandArg, IGitResponse } from "types/interfaces";

/**
 * Git command response.
 * @param   {string}      msg     - Response message.
 * @param   {boolean}     success - Request succeeded/failed.
 * @returns {IGitResponse}
 */
export const gitRes = (msg: string, success: boolean): IGitResponse => {
  return {
    message: msg,
    success: success,
  };
};

export const gitCommandDoesNotExist = (): IGitResponse => {
  return {
    message:
      "Error: this command either does not exist, or is not integrated into the game",
    success: false,
  };
};

class Git {
  /**
   * Find the correct CommandArg from list of args
   * @param   {string}              currentKey
   * @param   {ICommandArg[]}       cmdArgs
   * @returns {ICommandArg | null}
   */
  private findCmdArg = (
    currentKey: string,
    cmdArgs: ICommandArg[]
  ): ICommandArg | null => {
    let dynamicArg: ICommandArg | null = null;
    for (let i = 0; i < cmdArgs.length; i++) {
      let currentCmdArg = cmdArgs[i];
      if (currentCmdArg.isDynamic) dynamicArg = currentCmdArg;
      if (currentKey === currentCmdArg.key) {
        return currentCmdArg;
      }
    }
    return dynamicArg;
  };

  /**
   * Parses the git commands and executes if valid.
   * @param   {string[]}    args - Command arguments.
   * @returns {IGitResponse}
   */
  private execGit = (
    gameData: IGitCooking,
    setGameData: (gameData: IGitCooking) => void,
    args: string[]
  ): IGitResponse => {
    if (args.length > 0) {
      let currentCmdArg: ICommandArg | null = null;
      let dynamicInput: string | undefined;
      for (let i = 0; i < args.length; i++) {
        let currentArgKey: string = args[i]
          .replaceAll('"', "")
          .replaceAll("'", "");
        let currentCmdArgs = currentCmdArg ? currentCmdArg.args : gitCommands;

        let tempCmdArg: ICommandArg | null = this.findCmdArg(
          currentArgKey,
          currentCmdArgs
        );

        if (tempCmdArg) {
          currentCmdArg = tempCmdArg;
          if (tempCmdArg.isDynamic) dynamicInput = currentArgKey;
        } else return gitRes("Invalid git command", false);
      }

      if (currentCmdArg?.cmd)
        return currentCmdArg.cmd(gameData, setGameData, dynamicInput);
      else return gitRes("Git command did not exist", false);
    } else return gitRes("Git command cannot be empty", false);
  };

  /**
   * Parses command and executes it if valid.
   * @param   {string}      command - Command to be parsed.
   * @returns {IGitResponse}
   */
  public exec = (
    gameData: IGitCooking,
    setGameData: (gameData: IGitCooking) => void,
    command: string
  ): IGitResponse => {
    let args = command.match(/(?:[^\s"']+|['"][^'"]*["'])+/g);
    if (!args) args = [""];

    if (args[0] === "git")
      return this.execGit(gameData, setGameData, args.slice(1));
    else return gitRes(`Command not found: ${args[0]}`, false);
  };
}

export const git = new Git();
