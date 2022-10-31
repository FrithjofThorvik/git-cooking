import React from "react";

import { IDirectory } from "../../../types/interfaces";
import DirectorySidebar from "../../../components/work/Directory";

interface IDirectoryControllerProps {}

const DirectoryController: React.FC<
  IDirectoryControllerProps
> = (): JSX.Element => {
  const directory: IDirectory = {
    folders: [
      {
        name: "Orders",
        folders: [
          {
            name: "Order #1",
            folders: [],
            files: [
              {
                name: "Burger",
              },
              {
                name: "Fries",
              },
            ],
            isOpen: true,
          },
          {
            name: "Order #2",
            folders: [],
            files: [
              {
                name: "Burger",
              },
              {
                name: "Fries",
              },
            ],
            isOpen: false,
          },
        ],
        files: [],
        isOpen: true,
      },
      {
        name: "ingredients",
        folders: [],
        files: [],
        isOpen: true,
      },
    ],
    files: [],
  };

  return <DirectorySidebar directory={directory} />;
};

export default DirectoryController;
