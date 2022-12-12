import { ITutorial } from "types/gameDataInterfaces";
import { TutorialType } from "types/enums";
import { imgFileStates, imgOrderArriving } from "assets/tutorials";

export const defaultTutorials: ITutorial[] = [
  {
    type: TutorialType.STORE_UPGRADES,
    description: "",
    screens: [],
    completed: false,
  },
  {
    type: TutorialType.STORE_INGREDIENTS,
    description: "",
    screens: [],
    completed: false,
  },
  {
    type: TutorialType.STORE_GIT_COMMANDS,
    description: "",
    screens: [],
    completed: false,
  },
  {
    type: TutorialType.WORK_FILES,
    description: "",
    screens: [
      {
        title: "Files",
        img: imgFileStates,
        prompts: [
          "In the left sidebar, when you create files/items, there are 3 different states or colors these can come in.",
          "Orange, means the file is modified and the change is yet to be prepared or added to the staging area.",
          "Green, means the files is ready to be commited and saved in your repository.",
          "White, means that everything is saved and recorded.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.WORK_ORDERS,
    description: "",
    screens: [
      {
        title: "Orders",
        img: imgOrderArriving,
        prompts: [
          "Throughout the day, orders will arrive. Complete these orders and use git commands to register and fulfill these orders for your restaurant.",
        ],
      },
    ],
    completed: false,
  },
];
