import React from "react";

import { IDirectory } from "types/interfaces";
import DirectoryFile from "./directory/DirectoryFile";
import Folder from "./directory/Folder";

import "./Directory.scss";

interface IDirectoryProps {
  directory: IDirectory;
}

const Directory: React.FC<IDirectoryProps> = ({ directory }): JSX.Element => {
  return (
    <div className="directory">
      <div className="directory-content">
        {directory.folders.map((folder, i) => {
          return <Folder folder={folder} key={i} />;
        })}
        {directory.files.map((file, i) => {
          return <DirectoryFile file={file} key={i} />;
        })}
      </div>
    </div>
  );
};

export default Directory;
