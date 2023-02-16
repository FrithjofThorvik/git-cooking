export const gitConcepts: { title: string; text: string }[] = [
  {
    title: "Git Introduction",
    text: "%Git% is a tool that helps you %manage the changes% you make to your files. It's like a %time machine% for your code! You can think of it as a way to keep track of all the changes you make to your code over time, so that you can always %go back to an earlier version% if you need to.\n\nWith Git, you can make changes to your code without worrying about losing anything, because Git %keeps a record of all the changes% you make. You can also work on your code %with other people%, and Git will help you merge everyone's changes together.\n\nGit has a few %basic concepts% you'll need to understand. The first is a %repository%, which is just a fancy word for a workspace that Git is keeping track of. You can create a new repository or %clone% an existing one.\n\nOnce you have a repository, you can make changes to your code and %commit% those changes. A %commit is like a snapshot% of your code at a particular point in time. You can add a message to each commit to describe what you changed.\n\nYou can also create %branches% in Git, which are like %alternate versions% of your code that you can experiment with. You can switch between branches and %merge% them together when you're ready.\n\nFinally, when you're ready to %share your code with others%, you can %push% your changes to a remote repository, like one hosted on GitHub.\n\nThat's the basic idea of Git! It can be a bit confusing at first, but once you get the hang of it, it's a very powerful tool for managing your code.\n\nIn the %following sections% you can get more %in-depth information% about git.",
  },
  {
    title: "Working Directory",
    text: "The %working directory% acts as the platform where you can %modify files% and make changes to your project. It can also be viewed as a checkout of a %version/snapshot% of your repository, where you can make changes. These changes are not saved in Git before you commit them or stage them. Within the working directory, files can be in one of two states, %tracked% or %untracked%. %Tracked files% are files that existed in the previous snapshot or in the staging area, whilst %untracked files% are new files not yet tracked in the Git repository.",
  },
  {
    title: "Staging Area",
    text: "A modified file from the working directory can be added to the %staging area%. The staging area contains information about which changes will be %stored in the next commit%. Meaning that the staging area contains information about the %modified files% in the state it was when it was added to the staging area.",
  },
  {
    title: "Commit",
    text: "A %commit% takes all the changes added to the staging area and %saves them to the Git repository%. Git stores its data in a series of %snapshots%, so whenever you commit, you save a snapshot of the current state of your files. Every commit contains a %pointer to its previous commit%, resulting in a %stream of snapshots% - called the %commit history%.",
  },
  {
    title: "Branch",
    text: "A %branch% in Git is essentially a pointer that %points to a commit%. The default branch is called the %main branch% or %master branch%. Whenever you commit, this branch points to the last commit you made, and for %each commit%, the main branch %pointer automatically moves forward%. Whenever you make a %new branch% you create a %new pointer% that points to the commit you branched from. This new branch pointer can move %independently from other branches%. Git also has a special pointer called %HEAD% which can be used to know %which branch you are currently on%. In this way you can switch between branches. This allows you to %experiment with changes% by making new branches, doing some changes in that branch and switching to another branch to make other changes. For these changes to be integrated with each other, Git supports a feature called %merging%, which %integrates the changes% with each other.",
  },
  {
    title: "Merge",
    text: "%Merging% is how Git manages to %integrate changes% from different branches together. Based on the changes made, the merge can happen in two different ways: %fast-forward merge% or %three-way merge%. A %fast-forward merge% occurs whenever the changes you are trying to merge can be reached by following the commit history. When this happens, the merge can be simplified by %moving the pointer forward%, as there are %no conflicting changes% to merge together. A %three-way merge% occurs when the commit history has %diverged% down the line. This happens when the commit of the branch you are trying to merge is %not a direct ancestor% of the branch you are merging in. In this case, Git creates a new commit, called a %merge-commit%, which takes the changes from the two branches and combines them. This commit is special compared to a normal commit as it has %more than one parent%. In the case that the changes between the two branches are in %conflict%, the three-way merge %cannot proceed%. This is called a %merge conflict% and it happens when the %same part% of a file is changed in %different ways% in the two branches you want to merge. When this happens, Git %pauses the merge% and cannot proceed until you have %resolved% the conflicting changes. Once the conflicting changes have been resolved, the merge can proceed in the same way as before.",
  },
  {
    title: "Remote",
    text: "Git enables you to collaborate on Git projects through %remote repositories%. A %remote repository% is similar to a normal Git repository, except that it is %hosted on the Internet%. This remote repository can then be accessed by multiple people, allowing %collaboration% through %pushing% and %pulling% in Git. %Pushing% and %pulling% is the act of %sending data% to the remote (pushing) and %getting data% from the remote (pulling). This enables you to work on a directory make some changes, commit those changes and the push those changes to the remote. The person you are collaborating with can then pull those changes, %gaining access to the changes you made%. If you want to start working on an existing remote repository, you can %clone the project%, which %pulls down every file% and its history from the %remote project%.",
  },
  {
    title: "Terminal",
    text: "A %terminal% is a %text-based% interface that allows you to interact with your computer system. By %chaining specific words% in your terminal input, you %navigate to specific programs% that you wish the computer to execute for you. If you want to use %git commands%, you need to start by writing %git% and chain keep %chaining the correct words% to reach the thing you need to run. All the %git commands% use the terminal",
  },
];
