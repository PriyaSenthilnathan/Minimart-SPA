import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <main className="not-found">
      <p className="not-found-code">404</p>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>

      <Link to="/" className="details-button">
        <ArrowLeft size={16} />
        Back to Home
      </Link>
    </main>
  );
}

export default NotFound;