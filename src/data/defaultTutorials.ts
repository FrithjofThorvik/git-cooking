import { ITutorial } from "types/gameDataInterfaces";
import { TutorialType } from "types/enums";
import {
  imgAddFolderItem,
  imgAddFolders,
  imgEndDayButton,
  imgGitFetchBranches,
  imgGitFetchTerminal,
  imgGitRepo,
  imgGitStagingArea,
  imgGitWorkScreen,
  imgGitWorkingDir,
  imgHelp,
  imgMatchOrders,
  imgOrderArriving,
  imgTerminal,
  imgTerminalCommands,
  imgTerminalCommandsClone,
} from "assets/tutorials";

export const defaultTutorials: ITutorial[] = [
  {
    type: TutorialType.GAME_INTRO,
    description: "Welcome to GitCooking!",
    screens: [
      {
        title: "Welcome to GitCooking",
        prompts: [
          "Hello! Welcome to your first day as a %work from home% chef!",
          "I will skip the formalities and jump %straight to the point...% I have created a system for managing multiple %digital restaurants% only by using your personal computer through this website.",
          "This system uses %git%, and I need you to learn how to use it to help me fulfill orders and manage these restaurants.",
          "The better and more efficient you become at using %git%, the more %profit% you will make, and the more items you are able to buy to grow our restaurants.",
          "Don't worry, I will introduce you little by little to what you need to do!",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.TERMINAL,
    description: "What is a terminal? How does it work? How do you use it?",
    screens: [
      {
        title: "Terminal introduction",
        prompts: [
          "First, in order to use %git% with this system, you need learn the basics of a computer %terminal%.",
          "A %terminal% is a %text-based% interface that allows yout to interact with your computer system.",
        ],
      },
      {
        title: "Terminal commands",
        img: imgTerminalCommands,
        prompts: [
          "By %chaining specific words% in your terminal input, you %navigate to specific programs% that you want the computer to execute for you.",
        ],
      },
      {
        title: "Terminal commands",
        img: imgTerminalCommandsClone,
        prompts: [
          "Try to use %git clone [PROJECT_URL]% in your terminal where you copy the URL of the %beginner% project.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.CLONE,
    description:
      "How to gain access to a remote repository? How to access branches?",
    screens: [
      {
        title: "Clone Terminal",
        prompts: [
          "Nice work! By using %git clone% you create a copy of an existing remote repository. Git fetches and updates your computer with the information from our remote system named %origin%.",
        ],
      },
      {
        title: "Branches",
        img: imgGitFetchBranches,
        prompts: [
          "After cloning a project, you wil have access to all the restaurants that I own, which we will be calling %branches%.",
          "To make changes to these %branches%, I will need you to learn some essential %git commands%.",
          "A %branch% can be accessed by using the command %git checkout [branch_name]% where you enter the name of the branch you want to work on.",
          "Give it a try!",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.ORIGIN,
    description: "What is origin?",
    screens: [
      {
        title: "What is origin?",
        prompts: [
          "Nice work! By using %git fetch% you fetch and update your computer with updated information from our remote system named %origin%.",
          "%origin% is a shorthand %alias% for the remote repository's URL.",
          "Now, get going! You have new orders to complete!",
        ],
      },
    ],
    completed: true,
  },
  {
    type: TutorialType.WORK_SCREEN,
    description:
      "What is the work screen? What is the difference between working directory, a staging area and a git repository?",
    screens: [
      {
        title: "Work Screen",
        img: imgGitWorkScreen,
        prompts: [
          "Welcome to the %work screen%. This is probably all new to you, so I will run you through the %basics%. Let's start by looking at the %three main parts% of the working screen… ",
        ],
      },
      {
        title: "Working Directory",
        img: imgGitWorkingDir,
        prompts: [
          "The %working directory% is where you can modify and create new items.",
        ],
      },
      {
        title: "Staging Area",
        img: imgGitStagingArea,
        prompts: [
          "The %staging area% allows you to temporarily %save and organize% your changes, and decide which changes to include in the %next commit%.",
        ],
      },
      {
        title: "Git Repository",
        img: imgGitRepo,
        prompts: [
          "The %git repository% is where items are delivered to the customer, and your changes are saved.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.WORK_FOLDERS,
    description: "How to create new order?",
    screens: [
      {
        title: "Folders",
        img: imgAddFolders,
        prompts: [
          "In the %left sidebar% you'll see a list of orders that you can %create%.",
          "Creating the order, will automatically %link% the items created under this folder to the order from the customer.",
        ],
      },
    ],
    completed: true,
  },
  {
    type: TutorialType.WORK_ITEMS,
    description: "How to create new items?",
    screens: [
      {
        title: "Files",
        img: imgAddFolderItem,
        prompts: [
          "To add items, simply click on  %'+ Add item'%  in the sidebar and then give the item a name.",
        ],
      },
    ],
    completed: true,
  },
  {
    type: TutorialType.WORK_ADD_FILES,
    description: "How to add files",
    screens: [
      {
        title: "Git add files",
        prompts: [
          "Great work on starting on your first order. Once you are done with the order, you can add your changes with the %git add .% command.",
          "You can add specific files as well, but simply add all your current changes by using %git add .% for now.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.WORK_COMMIT,
    description: "How to commit",
    screens: [
      {
        title: "Git commit",
        img: imgTerminal,
        prompts: [
          "Nice work on adding your first changes! Now try to %git commit% the changes you have added.",
          "%git commit -m [message]%, is the command you need to use. All commits need a message, and by using %-m%, the message can be attached in one go. This is done so you easily can locate your previous commits in case you need to undo any mistakes.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.WORK_ORDERS,
    description: "How do I play?",
    screens: [
      {
        title: "Orders",
        img: imgOrderArriving,
        prompts: [
          "Throughout the day, %orders% will arrive at the restaurant. Use %git commands% to efficiently %register and fulfill% these orders to ensure timely and accurate service for our customers.",
        ],
      },
      {
        title: "Item Editor",
        img: imgMatchOrders,
        prompts: [
          "The goal is to %build% each item to match the %customer's order%.",
        ],
      },
      {
        title: "Let's start",
        prompts: ["Let's start cookin!"],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.TIMES_UP,
    description: "Time's up!",
    screens: [
      {
        title: "Time's up!",
        prompts: [
          "When the time is up, you cannot modify items anymore, but you are free to %finish things% up with %git commands%, try adding and committing any changes you missed!",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.WORK_PUSH,
    description: "What is pushing?",
    screens: [
      {
        title: "Push",
        prompts: [
          "Great work chef! Now your work is finished on this branch, you can use %git push% so that our remote system will be updated with your changes.",
          "You can also use %git push origin [branch_name]% if you want to push the progress of another branch than the one you are currently on.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.MERGE,
    description: "What does merging do?",
    screens: [
      {
        title: "MERGE!",
        prompts: [
          "For you to get %profit% from the changes you have made at the %restaurant(s)% they must be integrated to the %main hub%, aka the %main branch%.",
          "To do so you will need to %merge% the branches or restaturant together into the %main branch%. The act of %merging% is simply the process of combining changes from two different branches.",
          "This is usually done with the %git merge [target_branch]% command, but I have %simplified% it for you since we are merging all the branches into the %main branch%. So you will only need to click the %merge button%.",
          "Just keep in mind that what is really happening is that the %git merge [target_branch]% command is run for each branch that is merged into %main%.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.FETCH,
    description: "How to get updated information from the remote?",
    screens: [
      {
        title: "Fetch Introduction",
        prompts: [
          "Before a %new day% starts, I have %deleted% all the %branches% from the previous day both on your %local computer% and in the %remote repository%. And then I have created %new branches% in the remote, with %new orders% from new customers.",
        ],
      },
      {
        title: "Fetch Introduction",
        img: imgGitFetchTerminal,
        prompts: [
          "This means that each day you start completely %fresh%! However, this also means that you need to learn how to %fetch% the updated information from the %remote repository%",
          "This is done by using the %git fetch% command. Give it a try!",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.WORK_CHECKOUT,
    description: "How to checkout other restaurants?",
    screens: [
      {
        title: "Checkout",
        img: imgEndDayButton,
        prompts: [
          "You are now ready to %end the day% and get %rewarded% for your hard work. This is done by pressing the %end day% button!",
          "However, if you have more time on the clock, feel free to %git checkout [branch name]% the other branches and do more work to earn more money. Rememeber to %push% your changes in these branches as well!",
          "If you don't remember the branch names, try buying the %git branch% command in order to see the names of available branches.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.HELP,
    description: "Where to find help?",
    screens: [
      {
        title: "Help!",
        img: imgHelp,
        prompts: [
          "If you need more %help% you can always view the tutorials again, in addition to an overview of %git commands% and important %git concepts%.",
          "Just look for the help button in %the bottom left% of the screen.",
        ],
      },
    ],
    completed: false,
  },
];
