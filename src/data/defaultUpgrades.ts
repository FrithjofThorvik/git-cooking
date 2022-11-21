import { v4 } from "uuid";

import { imgLogo } from "assets";
import { IUpgrade } from "types/gameDataInterfaces";
import { UpgradeType } from "types/enums";

export const defaultUpgrades: IUpgrade[] = [
  {
    id: v4(),
    image: imgLogo,
    name: "Salad",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    cost: 250,
    unlocked: true,
    purchased: true,
    type: UpgradeType.INGREDIENTS,
  },
  {
    id: v4(),
    image: imgLogo,
    name: "Salad",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    cost: 250,
    unlocked: true,
    purchased: false,
    type: UpgradeType.INGREDIENTS,
  },
  {
    id: v4(),
    image: imgLogo,
    name: "Salad",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    cost: 250,
    unlocked: true,
    purchased: false,
    type: UpgradeType.COMMANDS,
  },
  {
    id: v4(),
    image: imgLogo,
    name: "Salad",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    cost: 250,
    unlocked: false,
    purchased: false,
    type: UpgradeType.INGREDIENTS,
  },
  {
    id: v4(),
    image: imgLogo,
    name: "Salad",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    cost: 250,
    unlocked: false,
    purchased: false,
    type: UpgradeType.UPGRADES,
  },
];
