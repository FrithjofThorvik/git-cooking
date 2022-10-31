import React from "react";

import FileView from "../../components/fileView/FileView";

interface IFileViewControllerProps {}

const FileViewController: React.FC<
  IFileViewControllerProps
> = (): JSX.Element => {
  return <FileView />;
};

export default FileViewController;
