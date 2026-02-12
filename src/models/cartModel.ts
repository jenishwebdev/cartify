import { createStore, createEvent } from "effector";
import type { Product, CartItem } from "../types";

const CART_KEY = "cartify-cart";

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export const $cart = createStore<CartItem[]>(loadCartFromStorage());

function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("Failed to save cart to localStorage:", err);
  }
}

$cart.watch(saveCart);

export const addToCart = createEvent<Product>();
export const removeFromCart = createEvent<number>();
export const increaseQty = createEvent<number>();
export const decreaseQty = createEvent<number>();
export const clearCart = createEvent();

$cart
  .on(addToCart, (cart, product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      return cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity ?? 1) + 1 }
          : item,
      );
    }
    return [...cart, { ...product, quantity: 1 }];
  })
  .on(removeFromCart, (cart, productId) =>
    cart.filter((item) => item.id !== productId),
  )
  .on(increaseQty, (cart, productId) =>
    cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: (item.quantity ?? 1) + 1 }
        : item,
    ),
  )
  .on(decreaseQty, (cart, productId) =>
    cart.map((item) => {
      if (item.id !== productId) return item;
      const qty = Math.max(1, (item.quantity ?? 1) - 1);
      return { ...item, quantity: qty };
    }),
  )
  .on(clearCart, () => []);

export const $totalItems = $cart.map((cart) =>
  cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
);

export const $totalPrice = $cart.map((cart) =>
  cart.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0),
);

export const $cartDrawerOpen = createStore(false);
export const openCartDrawer = createEvent();
export const closeCartDrawer = createEvent();

$cartDrawerOpen.on(openCartDrawer, () => true).on(closeCartDrawer, () => false);
