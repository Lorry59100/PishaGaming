export const cartService = {
    getCartItems: () => {
      const getCart = localStorage.getItem('cart');
      return getCart ? JSON.parse(getCart) : [];
    },
    clearCart: () => {
      localStorage.removeItem('cart');
    },
  };
  