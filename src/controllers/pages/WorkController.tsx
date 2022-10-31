import React from "react";

import { IDirectory } from "../../types/interfaces";
import Orders from "../../components/orders/Orders";
import DirectorySidebar from "../../components/sidebars/DirectorySidebar";
import InfoBoxController from "../components/InfoBoxController";
import TerminalController from "../components/TerminalController";

import "./WorkController.scss";
import CommitHistoryController from "../components/CommitHistoryController";

interface IWorkControllerProps {}

const WorkController: React.FC<IWorkControllerProps> = (): JSX.Element => {
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

  return (
    <div className="work">
      <DirectorySidebar directory={directory} />
      <TerminalController />
      <InfoBoxController />
      <Orders />
      <CommitHistoryController />
    </div>
  );
};

export default WorkController;
