export interface IFile {
  name: string;
}

export interface IFolder {
  name: string;
  folders: IFolder[];
  files: IFile[];
  isOpen: boolean;
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

export interface IUpgradeMenu {
  categories: {
    title: string;
    icon?: "home" | "code" | "fastfood";
    id: number;
    items: IUpgradeCard[];
  }[];
  buyItem: (itemId: number) => void;
}

export interface IUpgradeCard {
  image: string;
  title: string;
  description: string;
  price: number;
  id: number;
  unlocked: boolean;
  bought: boolean;
}
