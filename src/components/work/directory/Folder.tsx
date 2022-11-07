import React, { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IFile, IFolder } from "types/gameDataInterfaces";
import DirectoryFile from "./DirectoryFile";

import "./Folder.scss";

interface IFolderProps {
  folder: IFolder;
  stagedFiles: IFile[];
  modifiedFiles: IFile[];
  modifyFile: (file: IFile) => void;
}

const Folder: React.FC<IFolderProps> = ({
  folder,
  stagedFiles,
  modifiedFiles,
  modifyFile,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="folder">
      <div className="folder-info" onClick={() => setIsOpen(!isOpen)}>
        <ChevronRightIcon
          style={{ transform: `rotate(${isOpen ? "90deg" : "0deg"})` }}
        />
        <div>{folder.name}</div>
      </div>
      {isOpen && (
        <div className="folder-container">
          {folder.folders.map((f, i) => {
            return (
              <Folder
                folder={f}
                stagedFiles={stagedFiles}
                modifiedFiles={modifiedFiles}
                modifyFile={modifyFile}
                key={i}
              />
            );
          })}
          {folder.files.map((file, i) => {
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
      )}
    </div>
  );
};

export default Folder;
