const readline = require("readline");
const fs = require("fs");
const fileUrl = "wishlist.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readFileToJson = () => {
  return new Promise((resolve) => {
    fs.readFile(fileUrl, "utf-8", (error, data) => {
      if (error) {
        throw new Error(error.message);
      }

      if (data.length === 0) {
        throw new Error("File is empty");
      }

      resolve(JSON.parse(data));
    });
  });
};

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

const validateOption = (numOption, min, max, selection) => {
  if (isNaN(numOption) || numOption < min || numOption > max) {
    console.error("Invalid option selected.");
    setTimeout(() => {
      console.clear();
      selection();
    }, 1000);
  }
};

const validateFloat = (question) => {
  return askQuestion(question).then((input) => {
    const price = parseFloat(input);
    if (isNaN(price)) {
      console.log("Not a valid number. Please try again.");
      return validateFloat(question);
    } else {
      return price;
    }
  });
};

module.exports = {
  askQuestion,
  validateFloat,
  validateOption,
  readFileToJson,
  fileUrl,
};
