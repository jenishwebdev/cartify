import { useUnit } from "effector-react";
import { addToCart } from "../models/cartModel";
import type { Product } from "../types";

export function ProductCard({ product }: { product: Product }) {
  const onAddToCart = useUnit(addToCart);
  const { title, price, thumbnail, category } = product;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-square w-full overflow-hidden bg-stone-50">
        <img
          src={thumbnail ?? "https://via.placeholder.com/300?text=No+image"}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
          {category}
        </span>
        <h2 className="mt-1 line-clamp-2 font-medium text-stone-900">
          {title}
        </h2>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-semibold text-stone-900">
            ${Number(price).toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="cursor-pointer rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
