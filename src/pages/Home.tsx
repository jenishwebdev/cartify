import { useEffect } from "react";
import { useUnit } from "effector-react";
import {
  $paginatedProducts,
  $productsPending,
  $productsError,
  $search,
  $category,
  $categories,
  $totalFiltered,
  setSearch,
  setCategory,
  loadProducts,
} from "../models/productModel";
import { ProductCard } from "../components/ProductCard";
import { Pagination } from "../components/Pagination";

export function Home() {
  const [
    products,
    pending,
    error,
    search,
    category,
    categories,
    totalFiltered,
    onSearchChange,
    onCategoryChange,
  ] = useUnit([
    $paginatedProducts,
    $productsPending,
    $productsError,
    $search,
    $category,
    $categories,
    $totalFiltered,
    setSearch,
    setCategory,
  ]);

  useEffect(() => {
    loadProducts();
  }, []);

  if (pending && products.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-12 w-12 animate-spin text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-sm text-stone-500">Loading products…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-800">Something went wrong</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-900 placeholder-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/20"
          aria-label="Search products"
        />
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/20"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {totalFiltered > 0 && (
        <p className="mb-4 text-sm text-stone-500">
          Showing {products.length} of {totalFiltered} products
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalFiltered === 0 && (
        <p className="py-12 text-center text-stone-500">
          No products match your filters.
        </p>
      )}

      <Pagination />
    </main>
  );
}
