import React from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { IFile } from "../../../types/interfaces";

import "./File.scss";

interface IFileProps {
  file: IFile;
}

const File: React.FC<IFileProps> = ({ file }): JSX.Element => {
  return (
    <div className="file">
      <DescriptionOutlinedIcon className="icon" />
      <div>{file.name}</div>
    </div>
  );
};

export default File;
