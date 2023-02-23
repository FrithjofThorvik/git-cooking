import React from "react";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

import "./MenuButton.scss";

export interface IMenuButtonProps {
  text: string;
  onClick: () => void;
  type?: "left" | "right" | "default";
  hide?: boolean;
}

const MenuButton: React.FC<IMenuButtonProps> = ({
  text,
  onClick,
  type = "default",
  hide,
}): JSX.Element => {
  return (
    <button
      className={`menu-button ${type}`}
      onClick={onClick}
      style={{
        opacity: hide ? "0" : "1",
        pointerEvents: hide ? "none" : "all",
      }}
    >
      {type === "left" && (
        <ChevronRightOutlinedIcon style={{ transform: "rotate(180deg)" }} />
      )}
      <div>{text}</div>
      {type === "right" && <ChevronRightOutlinedIcon />}
    </button>
  );
};

export default MenuButton;
