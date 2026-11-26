
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { getProducts } from "../services/api";
import "../App.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [productNotFound, setProductNotFound] = useState(false);

  // Fetch product details from Flask
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      try {
        setIsLoading(true);
        setError("");
        setProduct(null);
        setProductNotFound(false);

        const products = await getProducts({
          signal: controller.signal
        });

        const foundProduct = products.find(
          (item) => item.id === Number(id)
        );

        if (!foundProduct) {
          setProductNotFound(true);
        } else {
          setProduct(foundProduct);
        }
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

    fetchProduct();

    return () => {
      controller.abort();
    };
  }, [id, retryCount]);

  if (isLoading) {
    return (
      <main className="details-container">
        <h2>Loading product details...</h2>
      </main>
    );
  }

  if (error) {
    return (
      <main className="details-container">
        <h2>Unable to load product</h2>
        <p>{error}</p>

        <button
          type="button"
          className="details-button"
          onClick={() => setRetryCount((prev) => prev + 1)}
        >
          Try Again
        </button>

        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </main>
    );
  }

  if (productNotFound || !product) {
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