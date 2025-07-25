/**
 * Challenge: Create a deep clone function
 *
 * Create a function that takes an object and returns a deep clone of that object. The function should handle nested objects, arrays, and primitive types.
 *
 * Requirements:
 * - The function should accept an object of any type.
 * - It should return a new object that is a deep clone of the original object.
 * - The function should handle nested objects and arrays.
 * - It should handle primitive types (strings, numbers, booleans, null, undefined).
 * - The function should not use any external libraries
 */

//? implement the function  here
import { readJsonFile } from "../1-ecommerce/utils/read-json.util";

import {  Brand } from "../1-ecommerce/1-types";

const deepClone = (obj: any): typeof obj => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      console.log(item);
      return deepClone(item);
    });
  } else {
    const cloneObj: any = {};
    Object.keys(obj).forEach((key) => {
      cloneObj[key] = deepClone(obj[key]);
    });
    return cloneObj;
  }
};

readJsonFile<Brand>("../1-ecommerce/data/brands.json").then((brand) => {
    const clonedProducts = deepClone(brand);
    console.log(brand);
    console.log(clonedProducts);
    console.log("Original object:", typeof brand);
    console.log("Cloned object:", typeof clonedProducts)
    console.log(JSON.stringify(brand) === JSON.stringify(clonedProducts) ? "Same object" : "Different objects");
    console.log("Are the original and cloned products the same object?", brand == clonedProducts);
});
