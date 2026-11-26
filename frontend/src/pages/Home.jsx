
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/api";
import "../App.css";

function Home() {
  const { cartCount } = useCart();

  // Product data from Flask API
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Category state
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Reference for search input
  const searchRef = useRef(null);

  // Fetch products from Flask
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProducts({
          signal: controller.signal
        });

        if (!Array.isArray(data)) {
          throw new Error("Invalid product data received from server.");
        }

        setProducts(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [retryCount]);

  // Update document title
  useEffect(() => {
    document.title = "MINIMART | Everyday Essentials";
  }, []);

  // Focus search when "/" key is pressed
  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.key === "/" &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Get unique categories from API products
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category))
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app">

      <Navbar
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchRef={searchRef}
      />

      <main className="main-container">

        <section className="hero-section">
          <p className="hero-label">SIMPLE THINGS. BETTER LIVING.</p>

          <h1>
            Everyday essentials,
            <br />
            thoughtfully selected.
          </h1>

          <p className="hero-description">
            Discover useful products designed to make
            everyday life a little simpler.
          </p>
        </section>

        <section className="shop-section">

          <div className="section-heading">
            <div>
              <p className="section-label">OUR COLLECTION</p>
              <h2>Explore products</h2>
            </div>

            <span className="product-count">
              {isLoading ? "Loading..." : `${filteredProducts.length} products`}
            </span>
          </div>

          {!isLoading && !error && products.length > 0 && (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="empty-state">
              <h3>Loading products...</h3>
              <p>Please wait while we fetch our collection.</p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="empty-state">
              <h3>Unable to load products</h3>
              <p>{error}</p>

              <button
                type="button"
                onClick={() => setRetryCount((prev) => prev + 1)}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty API Response */}
          {!isLoading && !error && products.length === 0 && (
            <div className="empty-state">
              <h3>No products available</h3>
              <p>Please check back later.</p>
            </div>
          )}

          {/* Product List */}
          {!isLoading && !error && products.length > 0 && (
            filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No products found</h3>
                <p>Try another search or category.</p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )
          )}

        </section>

      </main>

      <footer className="footer">
        <p>© 2026 MINIMART. Made for everyday living.</p>
      </footer>

    </div>
  );
}

export default Home;