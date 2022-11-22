import { IIngredient, IOrder, IOrderItem } from "types/gameDataInterfaces";
import { IGitTree } from "types/gitInterfaces";
import { defaultGameData } from "data/defaultData";
import { createNewOrderItem } from "services/gameDataHelper";
import { IngredientType } from "types/enums";
import { IFood } from "types/foodInterfaces";

const createNewFile = (git: IGitTree, name: string) => {
  // create new file
  const order = git.workingDirectory.orders[0];
  const newOrderItem: IOrderItem = createNewOrderItem(order, name);
  git.modifiedItems = git.handleModifyItem(newOrderItem);
  git.workingDirectory = git.workingDirectory.addOrderItemToOrder(
    order,
    newOrderItem
  );
  return newOrderItem;
};

const deleteFile = (git: IGitTree, orderItem: IOrderItem) => {
  git.modifiedItems = git.handleModifyItem(orderItem, true);
  git.workingDirectory = git.workingDirectory.deleteOrderItem(orderItem);
};

const modifyOrderItem = (
  git: IGitTree,
  orderItem: IOrderItem,
  data: {
    type?: IngredientType;
    addIngredient?: IIngredient;
    removeIngredientAtIndex?: number;
  }
) => {
  git.workingDirectory = git.workingDirectory.modifyOrderItem(
    orderItem,
    data,
    (o) => (git.modifiedItems = git.handleModifyItem(o))
  );
};

let git: IGitTree;
let burger: IFood;
describe("restore", () => {
  beforeEach(() => {
    git = defaultGameData.git;

    /** Create a order to be used in testing**/
    let newOrder: IOrder = {
      id: "id",
      name: "test folder",
      timeStart: 0,
      timeEnd: 1,
      isCreated: false,
      orderItems: [],
      items: [],
    };
    const newOrderItem: IOrderItem = createNewOrderItem(newOrder, "test item");
    burger = defaultGameData.store.foods[0];
    newOrderItem.ingredients = burger.builder();
    newOrder.orderItems = [newOrderItem];
    git.workingDirectory.orders = [newOrder];
    git.workingDirectory = git.workingDirectory.createOrderFolder(newOrder);
  });
  test("new file -> should not restore", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // should be in modified
    expect(git.modifiedItems).toContainEqual({
      added: true,
      deleted: false,
      item: newOrderItem,
    });

    // working directory should relfect the changes
    expect(git.workingDirectory.orders[0].items).toContainEqual(newOrderItem);

    // restore all items
    git = git.restoreAllFiles();

    // modified should still contain the item
    expect(git.modifiedItems).toContainEqual({
      added: true,
      deleted: false,
      item: newOrderItem,
    });

    // working directory should should still have the file
    expect(git.workingDirectory.orders[0].items).toContainEqual(newOrderItem);
  });
  test("new file + staged + modified -> should restore to staged", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.getGitTreeWithAllStagedItems();

    // modify file
    const ingredient = burger.ingredients.paddy;
    modifyOrderItem(git, newOrderItem, {
      addIngredient: ingredient,
    });

    // should be in modified items array
    expect(git.modifiedItems).toContainEqual({
      added: false,
      deleted: false,
      item: {
        ...newOrderItem,
        ingredients: [ingredient],
      },
    });

    // check that working directory reflect the changes
    expect(git.workingDirectory.orders[0].items).toContainEqual({
      ...newOrderItem,
      ingredients: [ingredient],
    });

    // restore all files
    git = git.restoreAllFiles();

    // modified should be empty
    expect(git.modifiedItems).toEqual([]);

    // working directory items should now equal staged item
    expect(git.workingDirectory.orders[0].items).toContainEqual(
      git.stagedItems[0].item
    );

    // stage should still contain the original staged file
    expect(git.stagedItems).toContainEqual({
      added: true,
      deleted: false,
      item: newOrderItem,
    });
  });
  test("new file + staged + delete -> should restore to staged", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.getGitTreeWithAllStagedItems();

    // delete file
    deleteFile(git, newOrderItem);

    // should be in modified items array
    expect(git.modifiedItems).toContainEqual({
      added: false,
      deleted: true,
      item: newOrderItem,
    });

    // check that working directory reflect the changes
    expect(git.workingDirectory.orders[0].items).not.toContainEqual(
      newOrderItem
    );

    // restore all files
    git = git.restoreAllFiles();

    // modified should be empty
    expect(git.modifiedItems).toEqual([]);

    // working directory items should now equal staged item
    expect(git.workingDirectory.orders[0].items).toContainEqual(
      git.stagedItems[0].item
    );

    // stage should still contain the original file
    expect(git.stagedItems).toContainEqual({
      added: true,
      deleted: false,
      item: newOrderItem,
    });
  });
  test("new file + staged + commit + modified -> should restore to previous commit", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.getGitTreeWithAllStagedItems();

    // commit the file
    git = git.getGitTreeWithNewCommit("first commit");

    // modify file
    const ingredient = burger.ingredients.paddy;
    modifyOrderItem(git, newOrderItem, {
      addIngredient: ingredient,
    });

    // should be in modified items array
    expect(git.modifiedItems).toContainEqual({
      added: false,
      deleted: false,
      item: { ...newOrderItem, ingredients: [ingredient] },
    });

    // check that working directory reflect the changes
    expect(git.workingDirectory.orders[0].items).toContainEqual({
      ...newOrderItem,
      ingredients: [ingredient],
    });

    const prevCommit = git.getHeadCommit();
    // should not be the same as the previous commit
    expect(git.workingDirectory.orders[0].items).not.toEqual(
      prevCommit?.directory.orders[0].items
    );

    // restore all files
    git = git.restoreAllFiles();

    // modified should be empty
    expect(git.modifiedItems).toEqual([]);

    // working directory items should now equal previous commit items
    expect(git.workingDirectory.orders[0].items).toEqual(
      prevCommit?.directory.orders[0].items
    );

    // and this should be equal to the original order
    expect(git.workingDirectory.orders[0].items).toEqual([newOrderItem]);
  });
  test("new file + staged + commit + delete -> should restore to previous commit", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.getGitTreeWithAllStagedItems();

    // commit the file
    git = git.getGitTreeWithNewCommit("first commit");

    // delete file
    deleteFile(git, newOrderItem);

    // should be in modified items array
    expect(git.modifiedItems).toContainEqual({
      added: false,
      deleted: true,
      item: newOrderItem,
    });

    // check that working directory reflect the changes
    expect(git.workingDirectory.orders[0].items).not.toContainEqual(
      newOrderItem
    );

    const prevCommit = git.getHeadCommit();
    // should not be the same as the previous commit
    expect(git.workingDirectory.orders[0].items).not.toEqual(
      prevCommit?.directory.orders[0].items
    );

    // and this should NOT be equal to the original order
    expect(git.workingDirectory.orders[0].items).not.toEqual([newOrderItem]);

    // restore all files
    git = git.restoreAllFiles();

    // modified should be empty
    expect(git.modifiedItems).toEqual([]);

    // working directory items should now equal previous commit items
    expect(git.workingDirectory.orders[0].items).toEqual(
      prevCommit?.directory.orders[0].items
    );

    // and this should be equal to the original order
    expect(git.workingDirectory.orders[0].items).toEqual([newOrderItem]);
  });
  test("new file + staged + commit + delete + stage + new file (same name) -> should not restore", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.getGitTreeWithAllStagedItems();

    // commit the file
    git = git.getGitTreeWithNewCommit("first commit");

    // delete file
    deleteFile(git, newOrderItem);

    // check that working directory reflect the changes
    expect(git.workingDirectory.orders[0].items).not.toContainEqual(
      newOrderItem
    );

    // stage the deleted file
    git = git.getGitTreeWithAllStagedItems();

    // should not be in modified items array
    expect(git.modifiedItems).not.toContainEqual({
      added: false,
      deleted: true,
      item: newOrderItem,
    });

    // stage should contain the deleted file
    expect(git.stagedItems).toContainEqual({
      added: false,
      deleted: true,
      item: newOrderItem,
    });

    // create new file
    const newerOrderItem = createNewFile(git, "test item");

    // restore all items
    git = git.restoreAllFiles();

    // modified should still contain the item
    expect(git.modifiedItems).toContainEqual({
      added: true,
      deleted: false,
      item: newerOrderItem,
    });

    // working directory should should still have the file
    expect(git.workingDirectory.orders[0].items).toContainEqual(newerOrderItem);

    // stage should still contain the deleted file
    expect(git.stagedItems).toContainEqual({
      added: false,
      deleted: true,
      item: newOrderItem,
    });
  });
});
