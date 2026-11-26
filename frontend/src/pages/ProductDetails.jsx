import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <main className="details-container">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="details-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <section className="details-card">
        <div className="details-image">
          <ShoppingBag size={80} strokeWidth={1} />
        </div>

        <div className="details-info">
          {product.badge && (
            <span className="product-badge">
              {product.badge}
            </span>
          )}

          <p className="details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <p className="details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="details-description">
            {product.description}
          </p>

          <Link to="/" className="details-button">
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;