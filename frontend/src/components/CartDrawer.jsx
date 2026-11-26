
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (!isOpen) return null;

  const formatPrice = (price) =>
    `₹${price.toLocaleString("en-IN")}`;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-drawer-header">
          <div>
            <h2>Your Cart</h2>
            <p>{cartCount} items</p>
          </div>

          <button
            type="button"
            className="cart-close-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {cart.length > 0 ? (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    <ShoppingBag size={25} />
                  </div>

                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>{formatPrice(item.price)}</p>

                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-cart-item"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <strong className="cart-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <p className="cart-note">
                Shipping and additional charges are calculated at checkout.
              </p>

              <Link
                to="/checkout"
                className="checkout-btn"
                onClick={onClose}
              >
                Proceed to Checkout
              </Link>

              <button
                type="button"
                className="continue-shopping-btn"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          <div className="cart-empty">
            <ShoppingBag size={45} strokeWidth={1.5} />
            <h3>Your cart is empty</h3>
            <p>Add some products to get started.</p>

            <button
              type="button"
              onClick={onClose}
              className="checkout-btn"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
