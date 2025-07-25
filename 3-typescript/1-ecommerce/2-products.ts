/**
 * Products - Challenge 1: Product Price Analysis
 *
 * Create a function that analyzes pricing information from an array of products.
 *
 * Requirements:
 * - Create a function called `analyzeProductPrices` that accepts an array of Product objects
 * - The function should return an object containing:
 *   - totalPrice: The sum of all product prices
 *   - averagePrice: The average price of all products (rounded to 2 decimal places)
 *   - mostExpensiveProduct: The complete Product object with the highest price
 *   - cheapestProduct: The complete Product object with the lowest price
 *   - onSaleCount: The number of products that are currently on sale
 *   - averageDiscount: The average discount percentage for products on sale (rounded to 2 decimal places)
 * - Prices should be manage in regular prices and not in sale prices
 * - Use proper TypeScript typing for parameters and return values
 * - Implement the function using efficient array methods
 *
 *
 **/
import { Brand, Product } from "./1-types";
import { readJsonFile } from "./utils/read-json.util";

type AnalysisProductPriceResult = {
  totalPrice: number;
  averagePrice: number;
  mostExpensiveProduct: Product;
  cheapestProduct: Product;
  onSaleCount: number;
  averageDiscount?: number;
};

async function analyzeProductPrices(
  products: Product[],
): Promise<AnalysisProductPriceResult> {
  let analysis: AnalysisProductPriceResult = {
    totalPrice: 0,
    averagePrice: 0,
    mostExpensiveProduct: products[0],
    cheapestProduct: products[0],
    onSaleCount: 0,
    averageDiscount: 0,
  };

  let totalDiscount = 0;

  products.forEach((product) => {
    analysis.totalPrice += product.price;
    if (product.price > analysis.mostExpensiveProduct.price) {
      analysis.mostExpensiveProduct = product;
    }
    if (product.price < analysis.cheapestProduct.price) {
      analysis.cheapestProduct = product;
    }

    if (product.onSale) {
      analysis.onSaleCount++;
      if (product.salePrice !== null) {
        totalDiscount +=
          ((product.price - product.salePrice) / product.price) * 100;
      }
    }
  });

  if (products.length > 0) {
    analysis.averagePrice =
      Math.round((analysis.totalPrice / products.length) * 100) / 100;

    if (analysis.onSaleCount > 0) {
      analysis.averageDiscount =
        Math.round((totalDiscount / analysis.onSaleCount) * 100) / 100;
    }
  }

  return analysis;
}

/*readJsonFile<Product>("./data/products.json").then((products) => {
  analyzeProductPrices(products).then((result) => {
    console.log(`Analyse product prices ${result}`);
  });
});*/

/**
 *  Challenge 2: Build a Product Catalog with Brand Metadata
 *
 * Create a function that takes arrays of Product and Brand, and returns a new array of enriched product entries. Each entry should include brand details embedded into the product, under a new brandInfo property (excluding the id and isActive fields).
 *  e.g
 *  buildProductCatalog(products: Product[], brands: Brand[]): EnrichedProduct[]

  Requirements:
  - it should return an array of enriched product entries with brand details
  - Only include products where isActive is true and their corresponding brand is also active.
  - If a product’s brandId does not match any active brand, it should be excluded.
  - The brandInfo field should include the rest of the brand metadata (name, logo, description, etc.).
 */

interface EnrichedProduct extends Product {
  brandInfo: Brand;
}

export async function buildProductCatalog(
  products: Product[],
  brands: Brand[],
): Promise<EnrichedProduct[]> {
  let enrichedProducts: EnrichedProduct[] = [];
  products.map((product) => {
    let enrichedProduct: EnrichedProduct;
    if (!product.isActive) {
      return;
    }

    const brand = brands.find(
      (brand) => brand.id === product.brandId && brand.isActive,
    );

    if (brand === undefined || !brand.isActive) {
      return;
    }

    enrichedProduct = {
      ...product,
      brandInfo: { ...brand },
    };

    enrichedProducts.push(enrichedProduct);
  });

  return enrichedProducts;
}

/*readJsonFile<Product>("./data/products.json").then((products) => {
  readJsonFile<Brand>("./data/brands.json").then((brands) => {
    buildProductCatalog(products, brands).then((result) => {
      console.log(result);
    });
  });
});*/

/**
 * Challenge 3: One image per product
 *
 * Create a function that takes an array of products and returns a new array of products, each with only one image.
 *
 * Requirements:
 * - The function should accept an array of Product objects.
 * - Each product should have only one image in the images array.
 * - The image should be the first one in the images array.
 * - If a product has no images, it should be excluded from the result.
 * - The function should return an array of Product objects with the modified images array.
 * - Use proper TypeScript typing for parameters and return values.
 */

async function filterProductsWithOneImage(
  products: Product[],
): Promise<Product[]> {
  // Implement the function logic here

  return products
    .map((product) => {
      if (product.images.length >= 1) {
        product.images = [product.images[0]];
        return product;
      }
    })
    .filter((product) => product !== undefined);
}

readJsonFile<Product>("./data/products.json").then((products) => {
  filterProductsWithOneImage(products).then((result) => {
    console.log(result);
  });
});
