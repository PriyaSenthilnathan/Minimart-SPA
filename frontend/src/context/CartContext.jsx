
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== productId)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Add or remove wishlist product
  const toggleWishlist = (product) => {
    setWishlist((previousWishlist) => {
      const alreadyExists = previousWishlist.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return previousWishlist.filter(
          (item) => item.id !== product.id
        );
      }

      return [...previousWishlist, product];
    });
  };

  // Cart item count
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Cart subtotal
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Wishlist count
  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        wishlistCount,
        toggleWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
