import { copyObjectWithoutRef } from "services/helpers";
import { TutorialType } from "types/enums";
import { IHelp, ITutorial } from "types/gameDataInterfaces";
import { defaultTutorials } from "./defaultTutorials";

let defaultHelp: IHelp = {
  tutorials: copyObjectWithoutRef(defaultTutorials),
  isHelpScreenOpen: false,
  unlockedTutorials: [],
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
  completeTutorials: function (tutorials) {
    let copy: IHelp = copyObjectWithoutRef(this);
    tutorials.forEach((_t) => {
      copy.tutorials.forEach((t) => {
        if (_t.type === t.type) {
          t.completed = true;
        }
      });
    });
    copy.unlockedTutorials = copy.unlockedTutorials.filter((uT) => {
      let isCompleted = false;
      copy.tutorials.forEach((t) => {
        if (t.type === uT.type) isCompleted = t.completed;
      });
      return !isCompleted;
    });
    return copy;
  },
  unlockTutorials: function (tutorials) {
    let copy: IHelp = copyObjectWithoutRef(this);
    tutorials
      .filter((t) => !t.completed) // not completed
      .filter((t) => !copy.unlockedTutorials.some((uT) => uT.type === t.type)) // not already unlocked
      .forEach((t) => {
        copy.unlockedTutorials.push(t);
      });
    return copy;
  },
};

defaultHelp.unlockedTutorials = defaultHelp.getTutorialsByTypes([
  TutorialType.GAME_INTRO,
  TutorialType.TERMINAL,
  TutorialType.HELP,
]);

export { defaultHelp };
