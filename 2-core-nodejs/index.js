const fs = require("fs");
const {
  askQuestion,
  fileUrl,
  readFileToJson,
  validateFloat,
  validateOption,
} = require("./utils");

async function menu() {
  console.clear();
  console.log("Welcome to your wish list\n");
  console.log("\t1- Add items to wishlist");
  console.log("\t2- View all wishlist items");
  console.log("\t3- Edit an existing item");
  console.log("\t4- Remove an item");
  console.log("\t5- Wishlist Summary\n");

  let menuOption = await askQuestion(
    "What we will do today? (Select an option): ",
  );

  let numOption = parseInt(menuOption);

  validateOption(numOption, 1, 5, menu);
  if (!fs.existsSync(fileUrl)) {
    fs.writeFile(fileUrl, "[]", "utf-8", (error) => {
      if (error) {
        console.error(error);
        return;
      }
    });
  }

  switch (numOption) {
    case 1:
      await createItem();
      break;
    case 2:
      await readItems();
      break;
    case 3:
      await updateItem();
      break;
    case 4:
      await deleteItem();
      break;
    case 5:
      await wishlistSummary();
      break;
  }
}

const backToMenu = () => {
  console.log("\nGo back to menu?");
  console.log("1- Yes");
  console.log("2- No");

  askQuestion("Select an option ").then((select) => {
    let numOption = parseInt(select);
    if (numOption == 1) {
      setTimeout(() => {
        menu();
      }, 1000);
    } else {
      process.exit();
    }
  });
};

const createItem = async () => {
  try {
    console.clear();
    console.log("Create a new item");
    let name = await askQuestion("What is the name? ");
    let price = await validateFloat("What is the price? ");
    let store = await askQuestion("What is the store? ");

    let oldData = (await readFileToJson()) || [];
    let newId = oldData.length == 0 ? 1 : oldData[oldData.length - 1].id + 1;

    let data = {
      id: newId,
      name: name,
      price: price.toFixed(2),
      store: store,
    };
    oldData.push(data);

    fs.writeFile(fileUrl, JSON.stringify(oldData), (err) => {
      if (err) throw Error(err.message);
      console.log(`\nThe item ${data.name} was created successful\n`);
      backToMenu();
    });
  } catch (error) {
    console.error("An error occurred while creating the item:", error);
    backToMenu();
  }
};

const readItems = async () => {
  readFileToJson()
    .then(async (items) => {
      if (Object.keys(items).length === 0) {
        console.log("\nThe wishlist is empty.\n");
      } else {
        console.log("\n", items);
      }
      backToMenu();
    })
    .catch((error) => {
      console.error("An error occurred while reading items:", error);
    });
};

async function updateItem() {
  try {
    console.clear();
    console.log("Edit an existing item");
    let id = parseInt(await askQuestion("What is the ID? "));
    let allData = await readFileToJson();

    let existItemIndex = allData.findIndex((item) => item.id == id);
    if (existItemIndex === -1) {
      console.log(`Item with id ${id} doesn't exist \n`);
      backToMenu();
    } else {
      let existItem = allData[existItemIndex];

      let name = await askQuestion(
        `What is the name? (old - ${existItem.name}): `,
      );
      let price = await validateFloat(
        `What is the price? (old - $${existItem.price}) $`,
      );
      let store = await askQuestion(
        `What is the store? (old - ${existItem.store}): `,
      );

      let data = {
        id: id,
        name: name,
        price: price.toFixed(2),
        store: store,
      };

      allData[existItemIndex] = data;

      fs.writeFile(fileUrl, JSON.stringify(allData), (err) => {
        if (err) throw Error(err.message);
        console.log(`The item ${data.name} was edited successful \n\n`);
        backToMenu();
      });
    }
  } catch (error) {
    console.error("An error occurred while edit the item:", error);
    backToMenu();
  }
}

async function deleteItem() {
  try {
    console.clear();
    console.log("Remove an item.");
    let id = parseInt(await askQuestion("What is the ID? "));
    let allData = await readFileToJson();

    let existItemIndex = allData.findIndex((item) => item.id == id);

    if (existItemIndex === -1) {
      console.log(`\nItem with id ${id} doesn't exist \n`);
      backToMenu();
    } else {
      let data = allData.splice(existItemIndex, 1);
      console.log(data);
      fs.writeFile(fileUrl, JSON.stringify(allData), (err) => {
        if (err) throw Error(err.message);
        console.log(`\nThe item ${data[0].name} was delete successful \n`);
        backToMenu();
      });
    }
  } catch (error) {
    console.error("An error occurred while deleting the item:", error);
    backToMenu();
  }
}

async function wishlistSummary() {
  return readFileToJson().then((allItems) => {
    let totalPrice = 0;
    let mostExpensive = allItems[0];
    let itemsCount = 0;
    let average = 0;
    allItems.forEach((item) => {
      let price = parseFloat(item.price);
      totalPrice += price;
      itemsCount++;

      if (mostExpensive.price < item.price) {
        mostExpensive = item;
      }
    });

    average = totalPrice / itemsCount;

    console.log("Most expensive item: ", mostExpensive);
    console.log(`Average price: $${average.toFixed(2)}`);
    console.log(`Total cost: $${totalPrice.toFixed(2)}`);
    console.log(`Number of items: ${itemsCount}`);

    backToMenu();
  });
}

menu();

module.exports = {
  backToMenu,
};
