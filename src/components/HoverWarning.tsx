import { useOutsideAlert } from "hooks/useOutsideAlert";
import { useRef } from "react";
import HighlightText from "./HighlightText";

import "./HoverWarning.scss";

interface IHoverWarning {
  show: boolean;
  text: string;
  handleClickOutside: () => void;
}

const HoverWarning: React.FC<IHoverWarning> = ({
  show,
  text,
  handleClickOutside,
}): JSX.Element => {
  const ref = useRef(null);

  useOutsideAlert(ref, () => {
    handleClickOutside();
  });

  if (!show) return <></>;
  return (
    <div className="hover-warning" ref={ref}>
      <HighlightText text={text} />
    </div>
  );
};

export default HoverWarning;
