
import { ShoppingBag, Search, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

function Navbar({ cartCount, searchQuery, setSearchQuery, searchRef }) {
  const { wishlistCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            MINI<span>MART</span>
          </Link>

          <div className="search-box">
            <Search size={18} />

            <input
              ref={searchRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="nav-actions">
            <Link to="/wishlist" className="nav-wishlist">
              <Heart size={20} />
              <span>Wishlist</span>
              <span className="cart-count">{wishlistCount}</span>
            </Link>

            <button
              type="button"
              className="cart-info"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} />
              <span>Cart</span>
              <span className="cart-count">{cartCount}</span>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}

export default Navbar;
