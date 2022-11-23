import { v4 } from "uuid";

import { IUpgrade } from "types/gameDataInterfaces";
import { imgClock, imgDiscount } from "assets";

export const defaultUpgrades: IUpgrade[] = [
  {
    id: v4(),
    image: imgClock,
    name: "Day Length x1.3",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    cost: 250,
    unlocked: true,
    purchased: false,
  },
  {
    id: v4(),
    image: imgDiscount,
    name: "10% Discount",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
    cost: 250,
    unlocked: true,
    purchased: false,
  },
];
