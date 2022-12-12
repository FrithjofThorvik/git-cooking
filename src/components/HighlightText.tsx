import React from "react";

import "./HighlightText.scss";

interface IHighlightTextProps {
  text: string;
  separator?: string;
}

const HighlightText: React.FC<IHighlightTextProps> = ({
  text,
  separator = "%",
}): JSX.Element => {
  const colorText = (text: string) => {
    const temp = text.split(separator);
    return (
      <span>
        {temp.map((v, i) => {
          if (i !== 0 && i !== temp.length - 1 && i % 2 !== 0) {
            return (
              <span style={{ color: "orange" }} key={i}>
                {v}
              </span>
            );
          } else return <span key={i}>{v}</span>;
        })}
      </span>
    );
  };
  return <div className="highlight-text">{colorText(text)}</div>;
};

export default HighlightText;
