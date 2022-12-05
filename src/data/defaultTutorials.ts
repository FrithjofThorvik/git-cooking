import { ITutorial } from "types/gameDataInterfaces";
import { TutorialType } from "types/enums";
import { imgChef, imgClock, imgUpgradeLvl1, imgUpgradeLvl5 } from "assets";

export const defaultTutorials: ITutorial[] = [
  {
    type: TutorialType.STORE_UPGRADES,
    description: "How does store upgrades work?",
    screens: [
      {
        title: "Upgrades1",
        img: imgUpgradeLvl1,
        prompts: ["S1_P1"],
      },
      {
        title: "Upgrades2",
        img: imgUpgradeLvl5,
        prompts: ["S2_P1", "S2_P2"],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.STORE_INGREDIENTS,
    description: "",
    screens: [
      {
        title: "Upgrades3",
        img: imgClock,
        prompts: ["S3_P1"],
      },
      {
        title: "Upgrades4",
        img: imgChef,
        prompts: ["S4_P1", "S4_P2"],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.STORE_GIT_COMMANDS,
    description: "",
    screens: [],
    completed: false,
  },
];
