import { copyObjectWithoutRef } from "services/helpers";
import { IHelp, ITutorial } from "types/gameDataInterfaces";
import { defaultTutorials } from "./defaultTutorials";

export const defaultHelp: IHelp = {
  tutorials: copyObjectWithoutRef(defaultTutorials),
  isHelpScreenOpen: false,
  setIsHelpScreenOpen: function (isOpen) {
    let copy: IHelp = copyObjectWithoutRef(this);
    copy.isHelpScreenOpen = isOpen;
    return copy;
  },
  getTutorialsByTypes: function (types) {
    const tutorials = this.tutorials;
    let filteredTutorials: ITutorial[] = [];
    types.forEach((type) => {
      for (let i = 0; i < tutorials.length; i++) {
        if (tutorials[i].type === type) {
          filteredTutorials.push(tutorials[i]);
          break;
        }
      }
    });
    return filteredTutorials;
  },
  completeTutorial: function (tutorial) {
    let copy: IHelp = copyObjectWithoutRef(this);
    copy.tutorials.forEach((t) => {
      if (tutorial.type === t.type) {
        t.completed = true;
      }
    });
    return copy;
  },
};
