import React from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { IFile } from "types/interfaces";

import "./DirectoryFile.scss";

interface IDirectoryFileProps {
  file: IFile;
}

const DirectoryFile: React.FC<IDirectoryFileProps> = ({
  file,
}): JSX.Element => {
  return (
    <div className="directory-file">
      <DescriptionOutlinedIcon className="directory-file-icon" />
      <div>{file.name}</div>
    </div>
  );
};

export default DirectoryFile;
