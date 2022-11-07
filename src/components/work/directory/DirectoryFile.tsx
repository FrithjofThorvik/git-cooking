import React, { useEffect, useState } from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { IFile } from "types/gameDataInterfaces";

import "./DirectoryFile.scss";

interface IDirectoryFileProps {
  file: IFile;
  stagedFiles: IFile[];
  modifiedFiles: IFile[];
  modifyFile: (file: IFile) => void;
}

const DirectoryFile: React.FC<IDirectoryFileProps> = ({
  file,
  stagedFiles,
  modifiedFiles,
  modifyFile,
}): JSX.Element => {
  const [isStaged, setIsStaged] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);

  useEffect(() => {
    let newIsStaged = false;
    let newIsModified = false;

    for (let i = 0; i < stagedFiles.length; i++) {
      if (stagedFiles[i].path === file.path) newIsStaged = true;
    }
    for (let i = 0; i < modifiedFiles.length; i++) {
      if (modifiedFiles[i].path === file.path) newIsModified = true;
    }

    setIsModified(newIsModified);
    setIsStaged(newIsStaged);
  }, [stagedFiles, modifiedFiles]);

  return (
    <div
      className="directory-file"
      style={{
        color: `${isModified ? "orange" : isStaged ? "green" : "white"}`,
      }}
      onClick={() => modifyFile(file)}
    >
      <DescriptionOutlinedIcon className="directory-file-icon" />
      <div>{file.name}</div>
    </div>
  );
};

export default DirectoryFile;
