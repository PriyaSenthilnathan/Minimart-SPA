
import { useState, useEffect, useRef } from "react";

import Navbar from "../components/Navbar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";

import products from "../data/products";
import { useCart } from "../context/CartContext";

import "../App.css";

function Home() {

  // Shared cart state
  const { cartCount, addToCart } = useCart();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Category state
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Reference for the search input
  const searchRef = useRef(null);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category))
  ];

  // Update document title
  useEffect(() => {
    document.title = "MINIMART | Everyday Essentials";
  }, []);

  // Focus search when the "/" key is pressed
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
              {filteredProducts.length} products
            </span>
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {filteredProducts.length > 0 ? (

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
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>

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
