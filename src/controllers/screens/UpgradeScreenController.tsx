import React from "react";
import UpgradeScreen, {
  IUpgradeScreenProps,
} from "components/screens/UpgradeScreen";
import { IUpgradeCard } from "types/interfaces";

interface IUpgradeScreenControllerProps {
  goNext: () => void;
  goBack: () => void;
}

const UpgradeScreenController: React.FC<IUpgradeScreenControllerProps> = ({
  goNext,
  goBack,
}): JSX.Element => {
  const upgradeItems: IUpgradeCard[] = [
    {
      image: "logo.png",
      title: "Salad",
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
      price: 250,
      id: 1,
      unlocked: true,
      bought: true,
    },
    {
      image: "chef.png",
      title: "Salad",
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
      price: 250,
      id: 2,
      unlocked: true,
      bought: false,
    },
    {
      image: "brick_wall.png",
      title: "Salad",
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
      price: 250,
      id: 3,
      unlocked: true,
      bought: false,
    },
    {
      image: "fire.png",
      title: "Salad",
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
      price: 250,
      id: 4,
      unlocked: false,
      bought: false,
    },
    {
      image: "background.png",
      title: "Salad",
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
      price: 250,
      id: 5,
      unlocked: false,
      bought: false,
    },
  ];

  const props: IUpgradeScreenProps = {
    nextButton: {
      text: "NEXT DAY",
      onClick: goNext,
      type: "green",
    },
    prevButton: {
      text: "RESULTS",
      onClick: goBack,
      type: "default",
    },
    menu: {
      categories: [
        { title: "Upgrades", icon: "home", id: 1, items: upgradeItems },
        { title: "Ingredients", icon: "fastfood", id: 2, items: upgradeItems },
        {
          title: "Git Commands",
          icon: "code",
          id: 3,
          items: [
            ...upgradeItems,
            {
              image: "logo.png",
              title: "Salad",
              description:
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo",
              price: 250,
              id: 6,
              unlocked: false,
              bought: false,
            },
          ],
        },
      ],
      buyItem: (itemId: number) => alert(itemId),
    },
  };
  return <UpgradeScreen {...props} />;
};

export default UpgradeScreenController;
