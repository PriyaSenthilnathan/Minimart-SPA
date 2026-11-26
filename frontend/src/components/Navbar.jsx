import { ShoppingBag, Search } from "lucide-react";

function Navbar({ cartCount, searchQuery, setSearchQuery }) {
  return (
    <header className="navbar">
      <div className="nav-container">

        <a href="/" className="logo">
          MINI<span>MART</span>
        </a>

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="cart-info">
          <ShoppingBag size={20} />
          <span>Cart</span>
          <span className="cart-count">{cartCount}</span>
        </div>

      </div>
    </header>
  );
}

export default Navbar;