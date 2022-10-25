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
