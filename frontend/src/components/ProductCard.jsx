
import { ShoppingCart, Plus, Minus, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    wishlist,
    toggleWishlist
  } = useCart();

  const cartItem = cart.find(
    (item) => item.id === product.id
  );

  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  );

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

        <button
          type="button"
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <Heart
            size={21}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        <div className="product-placeholder">
          <ShoppingCart size={38} />
        </div>

      </div>

      <div className="product-details">

        <h3>
          <Link
            to={`/product/${product.id}`}
            className="product-title-link"
          >
            {product.name}
          </Link>
        </h3>

        <p>{product.description}</p>

        <div className="product-footer">

          <span className="product-price">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {cartItem ? (

            <div className="quantity-control">

              <button
                type="button"
                onClick={() => decreaseQuantity(product.id)}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>

              <span>{cartItem.quantity}</span>

              <button
                type="button"
                onClick={() => increaseQuantity(product.id)}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>

            </div>

          ) : (

            <button
              type="button"
              className="add-cart-btn"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

          )}

        </div>

      </div>

    </article>
  );
}

export default ProductCard;