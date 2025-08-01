/**
 *  Challenge 5: Get Departments with Product Count
 *
 * Create a function that takes an array of departments and products, and returns a new array of departments with the amount of products available in each department.
 *
 * Requirements:
 * - The function should accept an array of Department objects and an array of Product objects.
 * - Each department should include the quantity of products available in that department.
 * - The department should be idetified just by its name and id other properties should be excluded.
 * - In the information of the department, include the amount of products available in that department and just the name and id of the department.
 * - Add the name of the products in an array called productsNames inside the department object.
 */

import { readJsonFile } from "./utils/read-json.util";
import { Department, Product } from "./1-types";

type DepartmentWithProductCount = Pick<Department, "id" | "name"> & {
  productCount: number;
  productsNames: string[];
};

async function getDepartmentsWithProductCount(
  departments: Department[],
  products: Product[],
): Promise<DepartmentWithProductCount[]> {
  // Implement the function logic
  const departmentMap = new Map<number, DepartmentWithProductCount>();

  departments.forEach((department) => {
    if (!department.isActive) {
      return;
    }

    departmentMap.set(department.id, {
      id: department.id,
      name: department.name,
      productCount: 0,
      productsNames: [],
    });
  });

  products.map((product) => {
    if (product.isActive) {
      const departmentId = product.departmentId;
      const productDepartment = departmentMap.get(departmentId);

      if (productDepartment) {
        departmentMap.set(departmentId, {
          ...productDepartment,
          productCount: productDepartment.productCount + 1,
          productsNames: [...productDepartment.productsNames, product.name],
        });
      }
    }
  });

  return Array.from(departmentMap.values());
}

readJsonFile<Department>("./data/departments.json").then((department) => {
  readJsonFile<Product>("./data/products.json").then((products) => {
    getDepartmentsWithProductCount(department, products).then((result) => {
      console.log(result);
    });
  });
});
