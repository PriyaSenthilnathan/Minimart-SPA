import { ShoppingBag, Search } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar({ cartCount, searchQuery, setSearchQuery }) {
    return (
        <header className="navbar">
            <div className="nav-container">

                <Link to="/" className="logo">
                    MINI<span>MART</span>
                </Link>

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