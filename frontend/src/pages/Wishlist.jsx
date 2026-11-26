
import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";

import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

import "../App.css";

function Wishlist() {

  const { wishlist } = useCart();

  return (
    <main className="wishlist-container">

      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Continue Shopping
      </Link>

      <div className="wishlist-heading">
        <div>
          <p className="section-label">YOUR COLLECTION</p>
          <h1>My Wishlist</h1>
        </div>

        <span>{wishlist.length} items</span>
      </div>

      {wishlist.length > 0 ? (

        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      ) : (

        <div className="wishlist-empty">
          <Heart size={45} strokeWidth={1.5} />

          <h2>Your wishlist is empty</h2>

          <p>
            Save your favourite products here
            and find them whenever you need.
          </p>

          <Link to="/" className="details-button">
            Explore Products
          </Link>
        </div>

      )}

    </main>
  );
}

export default Wishlist;
