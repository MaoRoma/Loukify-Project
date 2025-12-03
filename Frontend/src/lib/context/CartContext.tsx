"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/types/Theme";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: { id: number; name: string; price: number }) => void;
  updateQuantity: (id: number, change: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: { id: number; name: string; price: number }) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartTotal = cartSubtotal;
  // Count unique product types, not total quantity
  const cartItemCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
