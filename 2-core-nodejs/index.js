const fs = require("fs");
const readline = require("readline");
const fileUrl = "wishlist.json";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

function validateOption(numOption, min, max, selection) {
  if (isNaN(numOption) || numOption < min || numOption > max) {
    console.error("Invalid option selected.");
    setTimeout(() => {
      console.clear();
      selection();
    }, 1000);
  }
}

readFileToJson = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileUrl, "utf-8", (error, data) => {
      if (error) {
        console.error(error);
        console.log("Error ocurried");
        backToMenu();
        return reject(error);
      }

      resolve(JSON.parse(data));
    });
  });
};

let backToMenu = () => {
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

async function menu() {
  console.clear();
  console.log("Welcome to your wish list\n");
  console.log("\t1- Add items to wishlist");
  console.log("\t2- View all wishlist items");
  console.log("\t3- Edit an existing item");
  console.log("\t4- Remove an item\n");

  let menuOption = await askQuestion(
    "What we will do today? (Select an option): ",
  );

  let numOption = parseInt(menuOption);

  validateOption(numOption, 1, 4, menu);
  if (!fs.existsSync(fileUrl))
    await fs.writeFile(fileUrl, "[]", "utf-8", (error) => {
      if (error) {
        console.error(error);
        return;
      }
    });
  switch (numOption) {
    case 1:
      createItem();
      break;
    case 2:
      readItems();
      break;
    case 3:
      updateItem();
      break;
    case 4:
      deleteItem();
      break;
  }
}

async function createItem() {
  console.clear();
  console.log("Create a new item");
  let name = await askQuestion("What is the name? ");
  let price = await askQuestion("What is the price? $");
  let store = await askQuestion("What is the store? ");

  let oldData = await readFileToJson();
  let newId = oldData.length == 0 ? 1 : oldData[oldData.length - 1].id + 1;

  let data = {
    id: newId,
    name: name,
    price: parseFloat(price).toFixed(2),
    store: store,
  };
  oldData.push(data);

  fs.writeFile(fileUrl, JSON.stringify(oldData), (err) => {
    if (err) throw Error(err.message);
    console.log(`\nThe item ${data.name} was created successful\n`);
    backToMenu();
  });
}

function readItems() {
  readFileToJson().then(async (items) => {
    if (Object.keys(items).length === 0) {
      console.log("\nThe wishlist is empty.\n");
    } else {
      console.log("\n", items);
    }
    backToMenu();
  });
}

async function updateItem() {
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
    let price = await askQuestion(
      `What is the price? (old - $${existItem.price}) $`,
    );
    let store = await askQuestion(
      `What is the store? (old - ${existItem.store}): `,
    );

    let data = {
      id: id,
      name: name,
      price: parseFloat(price),
      store: store,
    };

    allData[existItemIndex] = data;

    fs.writeFile(fileUrl, JSON.stringify(allData), (err) => {
      if (err) throw Error(err.message);
      console.log(`The item ${data.name} was edited successful \n\n`);
      backToMenu();
    });
  }
}

async function deleteItem() {
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
    console.log(data)
    fs.writeFile(fileUrl, JSON.stringify(allData), (err) => {
      if (err) throw Error(err.message);
      console.log(`\nThe item ${data[0].name} was delete successful \n`);
      backToMenu();
    });
  }
}
menu();
