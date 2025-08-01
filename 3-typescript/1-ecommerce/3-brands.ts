/**
 *  Challenge 4: Get Countries with Brands and Amount of Products
 *
 * Create a function that takes an array of brands and products, and returns the countries with the amount of products available in each country.
 *
 * Requirements:
 * - The function should accept an array of Brand objects and an array of Product objects.
 * - Each brand should have a country property.
 * - Each product should have a brandId property that corresponds to the id of a brand.
 * - The function should return an array of objects, each containing a country and the amount of products available in that country.
 * - The amount of products should be calculated by counting the number of products that have a brandId matching the id of a brand in the same country.
 * - The return should be a type that allow us to define the country name as a key and the amount of products as a value.
 */

import { Brand, Product } from "./1-types";
import { buildProductCatalog } from "./2-products";
import { readJsonFile } from "./utils/read-json.util";

type CountryProductCount = {
  country: string;
  productCount: number;
};

async function getCountriesWithBrandsAndProductCount(
  brands: Brand[],
  products: Product[],
): Promise<CountryProductCount[]> {
  // Implement the function logic here
  const enrichedProducts = await buildProductCatalog(products, brands);
  const countryProductMap = new Map<string, number>();

  enrichedProducts.forEach((product) => {
    const country = product.brandInfo.headquarters.split(", ")[1];
    countryProductMap.set(country, (countryProductMap.get(country) ?? 0) + 1);
  });

  return Array.from(countryProductMap, ([country, productCount]) => ({
    country,
    productCount,
  }));
}

readJsonFile<Brand>("./data/brands.json").then((brands) => {
  readJsonFile<Product>("./data/products.json").then((products) => {
    getCountriesWithBrandsAndProductCount(brands, products).then((result) => {
      console.log(result);
    });
  });
});
