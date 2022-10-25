import React from "react";

import { IDirectory } from "../../types/interfaces";
import File from "./directorySidebar/File";
import Folder from "./directorySidebar/Folder";
import GlassContainer from "../GlassContainer";

import "./DirectorySidebar.scss";

interface IDirectorySidebarProps {
  directory: IDirectory;
}

const DirectorySidebar: React.FC<IDirectorySidebarProps> = ({
  directory,
}): JSX.Element => {
  return (
    <div className="sidebar">
      <GlassContainer>
        <div className="directory">
          {directory.folders.map((folder, i) => {
            return <Folder folder={folder} key={i} />;
          })}
          {directory.files.map((file, i) => {
            return <File file={file} key={i} />;
          })}
        </div>
      </GlassContainer>
    </div>
  );
};

export default DirectorySidebar;
