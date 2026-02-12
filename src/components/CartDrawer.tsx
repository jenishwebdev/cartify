import { useUnit } from "effector-react";
import {
  $cart,
  $totalItems,
  $totalPrice,
  closeCartDrawer,
  $cartDrawerOpen,
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../models/cartModel";
import {
  checkout,
  $checkoutPending,
  $checkoutSuccess,
  resetCheckoutSuccess,
} from "../models/checkoutModel";

export function CartDrawer() {
  const [
    cart,
    totalItems,
    totalPrice,
    open,
    onClose,
    onIncreaseQty,
    onDecreaseQty,
    onRemove,
    onCheckout,
    checkoutPending,
    checkoutSuccess,
    onResetSuccess,
  ] = useUnit([
    $cart,
    $totalItems,
    $totalPrice,
    $cartDrawerOpen,
    closeCartDrawer,
    increaseQty,
    decreaseQty,
    removeFromCart,
    checkout,
    $checkoutPending,
    $checkoutSuccess,
    resetCheckoutSuccess,
  ]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleClose = () => {
    onClose();
    if (checkoutSuccess) onResetSuccess();
  };

  if (!open) return null;

  return (
    <>
      <div
        role="presentation"
        className="fixed inset-0 z-50 cursor-pointer bg-stone-900/40 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden
      />
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-white shadow-xl sm:w-md"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
          <h2 className="text-lg font-semibold text-stone-900">
            Cart ({totalItems})
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close cart"
            className="cursor-pointer rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {checkoutSuccess ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-center text-lg font-medium text-stone-900">
              Order placed successfully
            </p>
            <p className="text-center text-sm text-stone-500">
              Thank you for your purchase.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {cart.length === 0 ? (
                <p className="py-8 text-center text-stone-500">
                  Your cart is empty.
                </p>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li
                      key={`${item.id}-${item.quantity}`}
                      className="flex gap-3 rounded-xl border border-stone-100 bg-stone-50/50 p-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                        <img
                          src={
                            item.thumbnail ?? "https://via.placeholder.com/64"
                          }
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-900">
                          {item.title}
                        </p>
                        <p className="text-sm font-semibold text-stone-700">
                          ${Number(item.price).toFixed(2)}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onDecreaseQty(item.id)}
                            className="cursor-pointer flex h-7 w-7 items-center justify-center rounded border border-stone-300 text-stone-600 hover:bg-stone-100"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="min-w-6 text-center text-sm">
                            {item.quantity ?? 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => onIncreaseQty(item.id)}
                            className="cursor-pointer flex h-7 w-7 items-center justify-center rounded border border-stone-300 text-stone-600 hover:bg-stone-100"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className="cursor-pointer ml-1 text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-stone-200 bg-white p-4">
              <div className="mb-3 flex justify-between text-sm">
                <span className="text-stone-500">Total</span>
                <span className="font-semibold text-stone-900">
                  ${Number(totalPrice).toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onCheckout()}
                disabled={cart.length === 0 || checkoutPending}
                className="w-full cursor-pointer rounded-full bg-stone-900 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkoutPending ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
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
                    Placing order…
                  </span>
                ) : (
                  "Checkout"
                )}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
