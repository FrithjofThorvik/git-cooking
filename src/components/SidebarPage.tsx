import { FC, useEffect, useRef, useState } from "react";

import "./SidebarPage.scss";

interface ISidebarPage {
  items: {
    title?: string;
    render: JSX.Element;
  }[];
}

const SidebarPage: FC<ISidebarPage> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const itemRefs = useRef<(null | HTMLDivElement)[]>([]);
  const scrollRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    // set active item to the item closest to the center of the scrollRef box
    const handleScroll = () => {
      const itemTopPos = itemRefs.current
        .slice(
          0,
          itemRefs.current.findIndex((i) => i === null)
        )
        .map((e) => e?.getBoundingClientRect().top);

      const scrollBox = scrollRef.current;
      if (scrollBox === null) return;

      const middleOfScrollBox =
        (scrollBox.getBoundingClientRect().bottom -
          scrollBox.getBoundingClientRect().top) /
        2;

      const closestToPositionIndex = itemTopPos.indexOf(
        itemTopPos.reduce((acc, x) => {
          if (acc === undefined || x === undefined) return x;
          return x === middleOfScrollBox
            ? x
            : x > middleOfScrollBox && x <= Math.abs(acc)
            ? x
            : x < middleOfScrollBox && -x < Math.abs(acc)
            ? x
            : acc;
        }, Infinity)
      );
      scrollBox.scrollTop === 0
        ? setActiveIndex(0)
        : setActiveIndex(closestToPositionIndex);
    };
    const current = scrollRef.current;
    current?.addEventListener("scroll", handleScroll);

    return () => {
      current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (index: number) => {
    itemRefs?.current?.at(index)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setActiveIndex(index);
  };

  if (!items) return <></>;
  return (
    <div className="wrapper">
      <div className="wrapper-sidebar">
        <div className="wrapper-sidebar-content">
          {items.map((item, index) => (
            <div
              className={
                index === activeIndex
                  ? "wrapper-sidebar-content-item active"
                  : "wrapper-sidebar-content-item"
              }
              onClick={() => handleClick(index)}
              key={index}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>
      <div className="wrapper-content" ref={scrollRef}>
        {items.map((item, index) => (
          <div
            className="wrapper-content-item"
            ref={(element) => itemRefs?.current?.push(element)}
            key={index}
          >
            <h1 className="wrapper-content-item-title">{item.title}</h1>
            <div className="wrapper-content-item-break" />
            <div className="wrapper-content-item-content">{item.render}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SidebarPage;
