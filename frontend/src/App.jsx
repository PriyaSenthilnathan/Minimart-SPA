import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./context/CartContext";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CartProvider>
  );
}

export default App;