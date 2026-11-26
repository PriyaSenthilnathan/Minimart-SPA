
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Package, ArrowLeft } from "lucide-react";
import "../App.css";

function OrderReceipt() {
  const location = useLocation();
  const order = location.state?.order;

  const formatPrice = (price) =>
    `₹${Number(price).toLocaleString("en-IN")}`;

  if (!order) {
    return (
      <main className="receipt-empty">
        <Package size={48} />
        <h2>No order details found</h2>
        <p>There is no order confirmation to display.</p>
        <Link to="/" className="details-button">
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="receipt-container">
      <div className="receipt-success-icon">
        <CheckCircle size={52} />
      </div>

      <p className="section-label">ORDER CONFIRMED</p>
      <h1>Thank you for your order!</h1>
      <p className="receipt-description">
        Your order has been placed successfully.
      </p>

      <section className="receipt-card">
        <div className="receipt-header">
          <div>
            <span>Order ID</span>
            <h3>#{order.order_id || order.id}</h3>
          </div>
          <Package size={28} />
        </div>

        <div className="receipt-divider" />

        <h3>Order Summary</h3>

        {order.items?.map((item) => (
          <div className="receipt-item" key={item.product_id || item.id}>
            <div>
              <strong>{item.name || item.product_name}</strong>
              <p>Quantity: {item.quantity}</p>
            </div>
            <span>
              {formatPrice(
                (item.price || 0) * item.quantity
              )}
            </span>
          </div>
        ))}

        <div className="receipt-divider" />

        <div className="receipt-total">
          <strong>Total Amount</strong>
          <strong>{formatPrice(order.total || order.total_amount || 0)}</strong>
        </div>
      </section>

      <div className="receipt-actions">
        <Link to="/" className="details-button">
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default OrderReceipt;
