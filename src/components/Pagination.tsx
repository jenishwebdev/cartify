import { useUnit } from "effector-react";
import { $page, $totalPages, setPage } from "../models/productModel";

export function Pagination() {
  const [page, totalPages, onSetPage] = useUnit([$page, $totalPages, setPage]);

  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onSetPage(page - 1)}
        disabled={prevDisabled}
        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className="px-3 py-2 text-sm text-stone-600">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onSetPage(page + 1)}
        disabled={nextDisabled}
        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
