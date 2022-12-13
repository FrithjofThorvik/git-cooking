import { ITutorial } from "types/gameDataInterfaces";
import { TutorialType } from "types/enums";
import {
  imgAddFolderItem,
  imgAddFolders,
  imgGitFetchBranches,
  imgGitFetchTerminal,
  imgGitRepo,
  imgGitStagingArea,
  imgGitWorkingDir,
  imgGitWorkScreen,
  imgMatchOrders,
  imgOrderArriving,
  imgTerminal,
} from "assets/tutorials";

export const defaultTutorials: ITutorial[] = [
  {
    type: TutorialType.FETCH_INTRO,
    description: "",
    screens: [
      {
        title: "Introduction",
        prompts: [
          "Hello! Welcome to your first day as a %work from home% chef!",
          "I will skip the formalities and jump %straight to the point...% I have created a system for managing multiple %digital restaurants% only by using your computer.",
          "This system uses %git%, and I need you to learn how to use it to help me fulfill orders and manage these restaurants.",
          "The better and more efficient you become at using %git%, the more %profit% you will make, and the more items you are able to buy to grow our restaurants.",
          "Don't worry, I will introduce you little by little to what you need to do!",
          "Let's begin by using the terminal at the bottom and %fetch% all the information we need for today by using %git fetch%.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.FETCH_CONTENT,
    description: "",
    screens: [
      {
        title: "Fetch Terminal",
        img: imgGitFetchTerminal,
        prompts: [
          "Nice work! By using %git fetch% you fetch and update your computer with updated information from our remote system named %origin%.",
        ],
      },
      {
        title: "Fetch Branches",
        img: imgGitFetchBranches,
        prompts: [
          "This includes some useful information on all the restaurants that I own, which we will be calling %branches%.",
          "To make changes to these %branches%, I will need you to learn some essential %git commands% in order for you to use the system.",
          "A %branch% can be accessed by using the command %git checkout [branch_name]% where you enter the name of the branch you want to start working on.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.WORK_FOLDERS,
    description: "",
    screens: [
      {
        title: "Folders",
        img: imgAddFolders,
        prompts: [
          "In the %left sidebar% you'll see a list of orders that you can %create%.",
          "I have made it easy for you %dumbwits%, so to create an order you only need to click on the %'+ [order name]' button%. This will automatically %link% the items created under this folder to the order from the customer.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.WORK_SCREEN,
    description: "",
    screens: [
      {
        title: "Work Screen",
        img: imgGitWorkScreen,
        prompts: [
          "Welcome to the %work screen%, where you'll be toiling away like a modern-day slave to satisfy the %never-ending hunger% of our restaurant customers. Don't worry, the %shackles% are only metaphorical. For now.",
          "This is probably all new to you, so I will run you through the %basics%. Let's start by looking at the %three main parts% of the working screen… ",
        ],
      },
      {
        title: "Working Directory",
        img: imgGitWorkingDir,
        prompts: [
          "The %working directory% where you can modify and create new items.",
        ],
      },
      {
        title: "Staging Area",
        img: imgGitStagingArea,
        prompts: [
          "The %staging area% allows you to temporarily %save and organize% your changes, and decide which changes to include in the %next commit%,",
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
    type: TutorialType.WORK_ITEMS,
    description: "",
    screens: [
      {
        title: "Files",
        img: imgAddFolderItem,
        prompts: [
          "To add items, simply click on  %'+ Add item'%  in the sidebar and then give the item a name.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.WORK_TERMINAL,
    description: "",
    screens: [
      {
        title: "Terminal",
        img: imgTerminal,
        prompts: [
          "Hey, what are you doing, We are not done with the tutorial! You will need to get familiar with the %terminal% to get going. The terminal is your way to %interact% with git.",
          "You can use the %'git status'% command to see the current status of your repository, including any changes you have made but haven't yet committed.",
          "You can use the %'git add .'% command to add all modified items to the staging area, and the %'git commit -m [message]'% command to commit those changes to the repository.",
          "You will %unlock% new commands as you keep playing, but for now try using %'git add .'%, then %'git commit -m [message]'% with a personalized message to deliver an order to a customer.",
        ],
      },
    ],
    completed: false,
  },
  {
    type: TutorialType.WORK_ORDERS,
    description: "",
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
    type: TutorialType.WORK_PUSH,
    description: "",
    screens: [
      {
        title: "Push",
        prompts: [
          "Great work chef! Now your work is finished on this branch, you can %git push% your changes so that our remote system can start implementing your work.",
          "If you have more time on the clock, feel free to %git checkout% the other branches and do more work to earn more money.",
          "When the time is up, you cannot modify items anymore, but you are free to finish things up with %git commands%, try adding and committing any changes you missed!",
          "Now, use %git push% to register your changes in the remote system for this branch. Use %git push origin [branch_name]% if you want to push progress on another branch than you are currently on.",
        ],
      },
    ],
    completed: false,
  },
];
