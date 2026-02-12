import { createEffect, createStore, createEvent, sample } from "effector";
import { clearCart } from "./cartModel";

export const checkout = createEvent();
export const resetCheckoutSuccess = createEvent();

const checkoutFx = createEffect(async (): Promise<{ success: true }> => {
  await new Promise((r) => setTimeout(r, 1500));
  return { success: true };
});

export const $checkoutPending = checkoutFx.pending;
export const $checkoutSuccess = createStore(false)
  .on(checkoutFx.doneData, () => true)
  .reset(checkout, resetCheckoutSuccess);

sample({
  clock: checkout,
  target: checkoutFx,
});

sample({
  clock: checkoutFx.doneData,
  target: clearCart,
});
