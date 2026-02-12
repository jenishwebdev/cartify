import {
  createStore,
  createEffect,
  combine,
  createEvent,
  sample,
} from "effector";
import type { Product, ProductsApiResponse } from "../types";

const PAGE_SIZE = 12;

const fetchProductsFx = createEffect(async (): Promise<Product[]> => {
  const res = await fetch("https://dummyjson.com/products?limit=500");
  if (!res.ok) throw new Error("Failed to fetch products");
  const data: ProductsApiResponse = await res.json();
  return data.products;
});

export const $products = createStore<Product[]>([])
  .on(fetchProductsFx.doneData, (_, products) => products)
  .reset(fetchProductsFx.fail);

export const $productsPending = fetchProductsFx.pending;
export const $productsError = createStore<string | null>(null)
  .on(fetchProductsFx.failData, (_, err) => err?.message ?? "Failed to load")
  .reset(fetchProductsFx);

export const $search = createStore("");
export const setSearch = createEvent<string>();
$search.on(setSearch, (_, value) => value);

export const $category = createStore("");
export const setCategory = createEvent<string>();
$category.on(setCategory, (_, value) => value);

export const $page = createStore(1);
export const setPage = createEvent<number>();
$page.on(setPage, (_, value) => value);

sample({
  clock: [setSearch, setCategory],
  fn: () => 1,
  target: setPage,
});

export const $filteredProducts = combine(
  $products,
  $search,
  $category,
  (products, search, category) => {
    const q = search.trim().toLowerCase();
    const cat = category.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch = !q || (p.title ?? "").toLowerCase().includes(q);
      const matchCategory = !cat || (p.category ?? "").toLowerCase() === cat;
      return matchSearch && matchCategory;
    });
  },
);

export const $totalFiltered = $filteredProducts.map(
  (products) => products.length,
);

export const $pageSize = createStore(PAGE_SIZE);

export const $totalPages = combine($totalFiltered, $pageSize, (total, size) =>
  Math.max(1, Math.ceil(total / size)),
);

export const $paginatedProducts = combine(
  $filteredProducts,
  $page,
  $pageSize,
  (products, page, size) => {
    const start = (page - 1) * size;
    return products.slice(start, start + size);
  },
);

export const $categories = $products.map((products) => {
  const set = new Set(products.map((p) => p.category).filter(Boolean));
  return [...set].sort() as string[];
});

export function loadProducts(): void {
  fetchProductsFx();
}
