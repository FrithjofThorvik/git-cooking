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
beforeEach(() => {
  git = defaultGameData.git;

  /** Create a order to be used in testing**/
  let newOrder: IOrder = {
    id: "id",
    name: "test folder",
    timeStart: 0,
    timeEnd: 1,
    isCreated: false,
    percentageCompleted: 0,
    orderItems: [],
    createdItems: [],
  };
  const newOrderItem: IOrderItem = createNewOrderItem(newOrder, "test item");
  burger = defaultGameData.store.foods[0];
  newOrderItem.ingredients = burger.builder();
  newOrder.orderItems = [newOrderItem];
  git.workingDirectory.orders = [newOrder];
  git.workingDirectory = git.workingDirectory.createOrderFolder(newOrder);
});
describe("restore", () => {
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
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual(newOrderItem);

    // restore all items
    git = git.restoreAllFiles();

    // modified should still contain the item
    expect(git.modifiedItems).toContainEqual({
      added: true,
      deleted: false,
      item: newOrderItem,
    });

    // working directory should should still have the file
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual(newOrderItem);
  });
  test("new file + staged + modified -> should restore to staged", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.stageAllItems();

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
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual({
      ...newOrderItem,
      ingredients: [ingredient],
    });

    // restore all files
    git = git.restoreAllFiles();

    // modified should be empty
    expect(git.modifiedItems).toEqual([]);

    // working directory items should now equal staged item
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual(
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
    git = git.stageAllItems();

    // delete file
    deleteFile(git, newOrderItem);

    // should be in modified items array
    expect(git.modifiedItems).toContainEqual({
      added: false,
      deleted: true,
      item: newOrderItem,
    });

    // check that working directory reflect the changes
    expect(git.workingDirectory.orders[0].createdItems).not.toContainEqual(
      newOrderItem
    );

    // restore all files
    git = git.restoreAllFiles();

    // modified should be empty
    expect(git.modifiedItems).toEqual([]);

    // working directory items should now equal staged item
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual(
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
    git = git.stageAllItems();

    // commit the file
    git = git.commit("first commit");

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
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual({
      ...newOrderItem,
      ingredients: [ingredient],
    });

    const prevCommit = git.getHeadCommit();
    // should not be the same as the previous commit
    expect(git.workingDirectory.orders[0].createdItems).not.toEqual(
      prevCommit?.directory.orders[0].createdItems
    );

    // restore all files
    git = git.restoreAllFiles();

    // modified should be empty
    expect(git.modifiedItems).toEqual([]);

    // working directory items should now equal previous commit items
    expect(git.workingDirectory.orders[0].createdItems).toEqual(
      prevCommit?.directory.orders[0].createdItems
    );

    // and this should be equal to the original order
    expect(git.workingDirectory.orders[0].createdItems).toEqual([newOrderItem]);
  });
  test("new file + staged + commit + delete -> should restore to previous commit", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.stageAllItems();

    // commit the file
    git = git.commit("first commit");

    // delete file
    deleteFile(git, newOrderItem);

    // should be in modified items array
    expect(git.modifiedItems).toContainEqual({
      added: false,
      deleted: true,
      item: newOrderItem,
    });

    // check that working directory reflect the changes
    expect(git.workingDirectory.orders[0].createdItems).not.toContainEqual(
      newOrderItem
    );

    const prevCommit = git.getHeadCommit();
    // should not be the same as the previous commit
    expect(git.workingDirectory.orders[0].createdItems).not.toEqual(
      prevCommit?.directory.orders[0].createdItems
    );

    // and this should NOT be equal to the original order
    expect(git.workingDirectory.orders[0].createdItems).not.toEqual([newOrderItem]);

    // restore all files
    git = git.restoreAllFiles();

    // modified should be empty
    expect(git.modifiedItems).toEqual([]);

    // working directory items should now equal previous commit items
    expect(git.workingDirectory.orders[0].createdItems).toEqual(
      prevCommit?.directory.orders[0].createdItems
    );

    // and this should be equal to the original order
    expect(git.workingDirectory.orders[0].createdItems).toEqual([newOrderItem]);
  });
  test("new file + staged + commit + delete + stage + new file (same name) -> should not restore", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.stageAllItems();

    // commit the file
    git = git.commit("first commit");

    // delete file
    deleteFile(git, newOrderItem);

    // check that working directory reflect the changes
    expect(git.workingDirectory.orders[0].createdItems).not.toContainEqual(
      newOrderItem
    );

    // stage the deleted file
    git = git.stageAllItems();

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
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual(newerOrderItem);

    // stage should still contain the deleted file
    expect(git.stagedItems).toContainEqual({
      added: false,
      deleted: true,
      item: newOrderItem,
    });
  });
});
describe("staging", () => {
  test("new file + stage + modify + stage -> should be added in stagedItems, and modified in modifiedItems", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // should be in modified
    expect(git.modifiedItems).toContainEqual({
      added: true,
      deleted: false,
      item: newOrderItem,
    });

    // working directory should relfect the changes
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual(newOrderItem);

    // stage the file
    git = git.stageAllItems();

    // stage now contain the item
    expect(git.stagedItems).toContainEqual({
      added: true,
      deleted: false,
      item: newOrderItem,
    });

    // should not be in modified
    expect(git.modifiedItems).not.toContainEqual({
      added: true,
      deleted: false,
      item: newOrderItem,
    });

    // working directory should should still have the file
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual(newOrderItem);

    // modify file
    const ingredient = burger.ingredients.paddy;
    modifyOrderItem(git, newOrderItem, {
      addIngredient: ingredient,
    });

    // should be in modified, but not added
    expect(git.modifiedItems).toContainEqual({
      added: false,
      deleted: false,
      item: {
        ...newOrderItem,
        ingredients: [ingredient],
      },
    });

    // stage should not contain the new change
    expect(git.stagedItems).not.toContainEqual({
      added: false,
      deleted: false,
      item: {
        ...newOrderItem,
        ingredients: [ingredient],
      },
    });

    // stage the file
    git = git.stageAllItems();

    // stage now contain the item
    expect(git.stagedItems).toContainEqual({
      added: false,
      deleted: false,
      item: {
        ...newOrderItem,
        ingredients: [ingredient],
      },
    });

    // should not be in modified
    expect(git.modifiedItems).not.toContainEqual({
      added: false,
      deleted: false,
      item: {
        ...newOrderItem,
        ingredients: [ingredient],
      },
    });

    // working directory should should still have the file
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual({
      ...newOrderItem,
      ingredients: [ingredient],
    });
  });
  test("new file + stage + delete -> should be added in stagedItems, but deleted in modifiedItems", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.stageAllItems();

    // delete file
    deleteFile(git, newOrderItem);

    // should be deleted in modified
    expect(git.modifiedItems).toContainEqual({
      added: false,
      deleted: true,
      item: newOrderItem,
    });

    // should be added in staged
    expect(git.stagedItems).toContainEqual({
      added: true,
      deleted: false,
      item: newOrderItem,
    });

    // working directory should not still have the file
    expect(git.workingDirectory.orders[0].createdItems).not.toContainEqual(
      newOrderItem
    );
  });
  test("new file + stage + commit + delete + stage + new file, same name -> should be deleted in stagedItems, but added in modifiedItems", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.stageAllItems();

    // commit the file
    git = git.commit("first commit");

    // delete file
    deleteFile(git, newOrderItem);

    // stage the change
    git = git.stageAllItems();

    // create a new file with same name
    const newerOrderItem = createNewFile(git, "test item");

    // should be added in modified
    expect(git.modifiedItems).toContainEqual({
      added: true,
      deleted: false,
      item: newerOrderItem,
    });

    // should be deleted in staged
    expect(git.stagedItems).toContainEqual({
      added: false,
      deleted: true,
      item: newOrderItem,
    });

    // working directory should have the new file
    expect(git.workingDirectory.orders[0].createdItems).toContainEqual(newerOrderItem);
  });
  test("new file + stage + commit + delete + stage + new file, same name + add -> should be modified in stagedItems", () => {
    // create new file
    const newOrderItem = createNewFile(git, "test item");

    // stage the file
    git = git.stageAllItems();

    // commit the file
    git = git.commit("first commit");

    // delete file
    deleteFile(git, newOrderItem);

    // stage the change
    git = git.stageAllItems();

    // create a new file with same name
    const newerOrderItem = createNewFile(git, "test item");

    // stage the change
    git = git.stageAllItems();

    // should be modified in staged
    expect(git.stagedItems).toContainEqual({
      added: false,
      deleted: false,
      item: newOrderItem,
    });
  });
});
