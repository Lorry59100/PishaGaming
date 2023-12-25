export const cartService = {
  getSessionCartItems: () => {
    const getCart = localStorage.getItem('cart');
    return getCart ? JSON.parse(getCart) : [];
  },
  clearSessionCart: () => {
    localStorage.removeItem('cart');
  },
  countSessionItemsInCart: () => {
    const cartItems = cartService.getSessionCartItems();
    return cartItems.reduce((total, currentItem) => total + currentItem.quantity, 0);
  },
};
