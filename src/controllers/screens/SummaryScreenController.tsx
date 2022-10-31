import React from "react";
import SummaryScreen, {
  ISummaryScreenProps,
} from "components/screens/SummaryScreen";

interface ISummaryScreenControllerProps {}

const SummaryScreenController: React.FC<
  ISummaryScreenControllerProps
> = (): JSX.Element => {
  const props: ISummaryScreenProps = {
    modal: {
      title: "Day 3",
      textLines: [
        { text: "Revenue:", value: 70 },
        { text: "Ingredients:", value: -50 },
        { text: "Profit:", value: 20 },
      ],
    },
    nextButton: {
      text: "next",
      onClick: () => 0,
      type: "green",
    },
    prevButton: {
      text: "merge",
      onClick: () => 0,
      type: "default",
    },
  };
  return <SummaryScreen {...props} />;
};

export default SummaryScreenController;
