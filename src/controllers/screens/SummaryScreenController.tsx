import React from "react";
import SummaryScreen, {
  ISummaryScreenProps,
} from "components/screens/SummaryScreen";

interface ISummaryScreenControllerProps {
  goNext: () => void;
  goBack: () => void;
}

const SummaryScreenController: React.FC<ISummaryScreenControllerProps> = ({
  goNext,
  goBack,
}): JSX.Element => {
  const props: ISummaryScreenProps = {
    modal: {
      title: "Day 3",
      textLines: [
        { text: "Revenue:", value: 70 },
        { text: "Ingredients:", value: -50 },
        { text: "Profit:", value: 20 },
      ],
    },
    goNext: goNext,
    goBack: goBack,
  };
  return <SummaryScreen {...props} />;
};

export default SummaryScreenController;
