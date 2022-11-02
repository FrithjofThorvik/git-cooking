import { imgLogo } from "assets";
import { IUpgrade } from "types/interfaces";
import { UpgradeType } from "types/enums";

export const upgrades: IUpgrade[] = [
  {
    image: imgLogo,
    name: "Salad",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    price: 250,
    id: 1,
    unlocked: true,
    purchased: true,
    type: UpgradeType.INGREDIENTS,
  },
  {
    image: imgLogo,
    name: "Salad",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    price: 250,
    id: 2,
    unlocked: true,
    purchased: false,
    type: UpgradeType.INGREDIENTS,
  },
  {
    image: imgLogo,
    name: "Salad",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    price: 250,
    id: 3,
    unlocked: true,
    purchased: false,
    type: UpgradeType.COMMANDS,
  },
  {
    image: imgLogo,
    name: "Salad",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    price: 250,
    id: 4,
    unlocked: false,
    purchased: false,
    type: UpgradeType.INGREDIENTS,
  },
  {
    image: imgLogo,
    name: "Salad",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    price: 250,
    id: 5,
    unlocked: false,
    purchased: false,
    type: UpgradeType.UPGRADES,
  },
];
