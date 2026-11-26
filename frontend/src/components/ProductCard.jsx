import { ShoppingCart } from "lucide-react";

function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">

      <div className="product-image">
        <span className="product-category">
          {product.category}
        </span>

        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}

        <div className="product-placeholder">
          <ShoppingCart size={38} />
        </div>
      </div>

      <div className="product-details">

        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <div className="product-footer">
          <span className="product-price">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <button
            className="add-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>

      </div>

    </article>
  );
}

export default ProductCard;