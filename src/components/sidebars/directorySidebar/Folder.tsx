import React, { useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { IFolder } from "../../../types/interfaces";
import File from "./File";

import "./Folder.scss";

interface IFolderProps {
  folder: IFolder;
}

const Folder: React.FC<IFolderProps> = ({ folder }): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="folder">
      <div className="info" onClick={() => setIsOpen(!isOpen)}>
        <KeyboardArrowRightIcon
          style={{ transform: `rotate(${isOpen ? "90deg" : "0deg"})` }}
        />
        <div>{folder.name}</div>
      </div>
      {isOpen && (
        <div className="container">
          {folder.folders.map((f, i) => {
            return <Folder folder={f} key={i} />;
          })}
          {folder.files.map((file, i) => {
            return <File file={file} key={i} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Folder;
