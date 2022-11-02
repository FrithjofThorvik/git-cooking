import {
  FileType,
  FolderType,
  GameState,
  IngredientType,
  UpgradeType,
} from "./enums";

export interface IFile {
  name: string;
  type: FileType;
  ingredientType: IngredientType;
  ingredient: IIngredient;
}

export interface IFolder {
  name: string;
  folders: IFolder[];
  files: IFile[];
  isOpen: boolean;
  type: FolderType;
}

export interface IDirectory {
  folders: IFolder[];
  files: IFile[];
}

export interface ICommitHistory {
  commits: ICommit[];
}

export interface ICommit {
  message: string;
  id: string;
}

export interface IIngredient {
  name: string;
  cost: number;
  purchased: boolean;
  image: string;
}

export interface IUpgrade {
  id: number;
  name: string;
  price: number;
  image: string;
  purchased: boolean;
  unlocked: boolean;
  description: string;
  type: UpgradeType;
}

export interface IGitCooking {
  day: number;
  cash: number;
  gameState: GameState;
  directory: IDirectory;
  upgrades: IUpgrade[];
}
