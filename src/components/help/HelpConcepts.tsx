import { gitConcepts } from "data/gitConcepts";
import SidebarPage from "components/SidebarPage";
import HighlightText from "components/HighlightText";

import "./HelpConcepts.scss";

interface IHelpConceptsProps {}

const HelpConcepts: React.FC<IHelpConceptsProps> = (): JSX.Element => {
  return (
    <div className="help-concepts">
      <SidebarPage
        items={gitConcepts.map((c) => {
          return {
            title: c.title,
            render: (
              <div className="help-concepts-text">
                <HighlightText text={c.text} />
              </div>
            ),
          };
        })}
      />
    </div>
  );
};

export default HelpConcepts;
