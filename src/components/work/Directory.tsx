import React from "react";

import { IDirectory, IFile } from "types/gameDataInterfaces";
import Folder from "./directory/Folder";
import DirectoryFile from "./directory/DirectoryFile";

import "./Directory.scss";

interface IDirectoryProps {
  directory: IDirectory;
  stagedFiles: IFile[];
  modifiedFiles: IFile[];
  modifyFile: (file: IFile) => void;
}

const Directory: React.FC<IDirectoryProps> = ({
  directory,
  stagedFiles,
  modifiedFiles,
  modifyFile,
}): JSX.Element => {
  return (
    <div className="directory">
      <div className="directory-content">
        {directory.folders.map((folder, i) => {
          return (
            <Folder
              folder={folder}
              stagedFiles={stagedFiles}
              modifiedFiles={modifiedFiles}
              modifyFile={modifyFile}
              key={i}
            />
          );
        })}
        {directory.files.map((file, i) => {
          return (
            <DirectoryFile
              file={file}
              stagedFiles={stagedFiles}
              modifiedFiles={modifiedFiles}
              modifyFile={modifyFile}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Directory;
