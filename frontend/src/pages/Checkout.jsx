
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import "../App.css";

function Checkout() {
  const {
    cart,
    cartCount,
    cartTotal,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (price) =>
    `₹${price.toLocaleString("en-IN")}`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError("");

      const orderData = {
        customer: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),

        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(orderData);

      // Clear cart only after successful order creation
      clearCart();

      // Navigate to confirmation page with actual order details
      navigate("/order-success", {
        state: {
          order: response.order
        }
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="checkout-container">
        <div className="checkout-empty">
          <ShoppingBag size={45} />
          <h2>Your cart is empty</h2>
          <p>Add products before proceeding to checkout.</p>

          <Link to="/" className="details-button">
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Continue Shopping
      </Link>

      <div className="checkout-heading">
        <p className="section-label">ALMOST THERE</p>
        <h1>Checkout</h1>
        <p>Enter your delivery details to place your order.</p>
      </div>

      {error && (
        <div className="checkout-error">
          <strong>Unable to place order</strong>
          <p>{error}</p>
          <p>Please check your details and try again.</p>
        </div>
      )}

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>

          <section className="checkout-section">
            <h2>Customer Information</h2>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9+\-\s()]{7,15}"
                  title="Enter a valid phone number"
                  required
                />
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <h2>Delivery Address</h2>

            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <textarea
                id="address"
                name="address"
                placeholder="House number, street name, area..."
                value={formData.address}
                onChange={handleChange}
                required
                minLength={5}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pincode">PIN Code</label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  placeholder="6-digit PIN code"
                  value={formData.pincode}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  title="Enter a valid 6-digit PIN code"
                  required
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="place-order-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <p className="summary-item-count">
            {cartCount} items in your cart
          </p>

          <div className="summary-products">
            {cart.map((item) => (
              <div className="summary-product" key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>

                <strong>
                  {formatPrice(item.price * item.quantity)}
                </strong>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>

          <p className="summary-note">
            Shipping charges and any additional fees will be calculated
            during order processing.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default Checkout;
