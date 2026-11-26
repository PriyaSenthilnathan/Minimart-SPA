const API_BASE_URL = "/api";

// Common API request handler
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Something went wrong. Please try again."
      );
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Unable to connect to the server."
    );
  }
}

// GET: Fetch all products
export function getProducts(options = {}) {
  return apiRequest("/products", {
    signal: options.signal,
  });
}

// POST: Create an order
export function createOrder(orderData) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

// PATCH: Update order status
export function updateOrderStatus(orderId, status) {
  return apiRequest(`/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
