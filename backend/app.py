
from flask import Flask, jsonify, request
from time import sleep
from itertools import count
import re

app = Flask(__name__)

# -----------------------------
# Product Data
# -----------------------------

PRODUCTS = [
    {
        "id": 1,
        "name": "Minimal Desk Organizer",
        "price": 799,
        "category": "Workspace",
        "badge": "Bestseller",
        "description": "A clean and practical organizer for your desk."
    },
    {
        "id": 2,
        "name": "Ergonomic Laptop Stand",
        "price": 1299,
        "category": "Workspace",
        "badge": "Popular",
        "description": "A sturdy stand for a comfortable working setup."
    },
    {
        "id": 3,
        "name": "LED Desk Lamp",
        "price": 999,
        "category": "Workspace",
        "badge": None,
        "description": "A modern lamp with adjustable lighting."
    },
    {
        "id": 4,
        "name": "Wireless Mouse",
        "price": 699,
        "category": "Tech",
        "badge": "Popular",
        "description": "A compact wireless mouse for everyday use."
    },
    {
        "id": 5,
        "name": "Bluetooth Speaker",
        "price": 1499,
        "category": "Tech",
        "badge": None,
        "description": "A portable speaker with clear sound."
    },
    {
        "id": 6,
        "name": "USB-C Hub",
        "price": 1199,
        "category": "Tech",
        "badge": None,
        "description": "A useful hub for connecting multiple devices."
    },
    {
        "id": 7,
        "name": "Ceramic Coffee Mug",
        "price": 399,
        "category": "Kitchen",
        "badge": "Bestseller",
        "description": "A simple ceramic mug for your favourite drinks."
    },
    {
        "id": 8,
        "name": "Glass Water Bottle",
        "price": 549,
        "category": "Kitchen",
        "badge": None,
        "description": "A reusable glass bottle for everyday hydration."
    },
    {
        "id": 9,
        "name": "Wooden Serving Tray",
        "price": 899,
        "category": "Kitchen",
        "badge": None,
        "description": "A versatile tray with a natural wooden finish."
    },
    {
        "id": 10,
        "name": "Canvas Tote Bag",
        "price": 499,
        "category": "Lifestyle",
        "badge": "Popular",
        "description": "A reusable tote bag for daily essentials."
    },
    {
        "id": 11,
        "name": "Insulated Travel Bottle",
        "price": 849,
        "category": "Lifestyle",
        "badge": None,
        "description": "A travel-friendly bottle for hot and cold drinks."
    },
    {
        "id": 12,
        "name": "Desk Plant Pot",
        "price": 349,
        "category": "Lifestyle",
        "badge": None,
        "description": "A minimal pot to brighten up your workspace."
    },
    {
        "id": 13,
        "name": "Hardcover Notebook",
        "price": 299,
        "category": "Stationery",
        "badge": "Bestseller",
        "description": "A hardcover notebook for notes and ideas."
    },
    {
        "id": 14,
        "name": "Premium Pen Set",
        "price": 449,
        "category": "Stationery",
        "badge": None,
        "description": "A set of smooth-writing everyday pens."
    },
    {
        "id": 15,
        "name": "Weekly Planner",
        "price": 379,
        "category": "Stationery",
        "badge": None,
        "description": "A simple planner to organize your week."
    }
]

# -----------------------------
# In-memory Order Storage
# -----------------------------

ORDERS = []
order_counter = count(1001)

VALID_ORDER_STATUSES = {
    "processing",
    "shipped",
    "delivered",
    "cancelled"
}


# -----------------------------
# Helper: Find a Product
# -----------------------------

def find_product(product_id):
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product

    return None


# -----------------------------
# GET: Retrieve All Products
# -----------------------------

@app.get("/api/products")
def get_products():

    # Simulate a slow API response
    if request.args.get("delay") == "1":
        sleep(2)

    # Simulate a server failure
    if request.args.get("fail") == "1":
        return jsonify({
            "error": "Unable to load products. Please try again later."
        }), 503

    return jsonify(PRODUCTS), 200


# -----------------------------
# POST: Create a New Order
# -----------------------------

@app.post("/api/orders")
def create_order():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Request body must contain valid JSON."
        }), 400

    customer = data.get("customer")
    email = data.get("email")
    items = data.get("items")

    # Validate customer name
    if not isinstance(customer, str) or len(customer.strip()) < 2:
        return jsonify({
            "error": "Customer name must contain at least 2 characters."
        }), 400

    # Validate email
    if not isinstance(email, str):
        return jsonify({
            "error": "A valid email address is required."
        }), 400

    email = email.strip()

    email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    if not re.match(email_pattern, email):
        return jsonify({
            "error": "Please enter a valid email address."
        }), 400

    # Validate cart items
    if not isinstance(items, list) or len(items) == 0:
        return jsonify({
            "error": "Your cart cannot be empty."
        }), 400

    order_items = []
    total = 0

    for item in items:

        if not isinstance(item, dict):
            return jsonify({
                "error": "Each cart item must be a valid object."
            }), 400

        product_id = item.get("productId")
        quantity = item.get("quantity")

        if type(product_id) is not int:
            return jsonify({
                "error": "Each item must have a valid product ID."
            }), 400

        if type(quantity) is not int or quantity < 1:
            return jsonify({
                "error": "Product quantity must be a positive whole number."
            }), 400

        product = find_product(product_id)

        if product is None:
            return jsonify({
                "error": f"Product with ID {product_id} was not found."
            }), 404

        subtotal = product["price"] * quantity
        total += subtotal

        order_items.append({
            "productId": product["id"],
            "name": product["name"],
            "price": product["price"],
            "quantity": quantity,
            "subtotal": subtotal
        })

    # Create the order
    order_id = f"MM-{next(order_counter)}"

    new_order = {
        "orderId": order_id,
        "customer": customer.strip(),
        "email": email,
        "items": order_items,
        "total": total,
        "status": "processing"
    }

    ORDERS.append(new_order)

    return jsonify({
        "message": "Order placed successfully.",
        "order": new_order
    }), 201


# -----------------------------
# PATCH: Update Order Status
# -----------------------------

@app.patch("/api/orders/<order_id>")
def update_order_status(order_id):

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Request body must contain valid JSON."
        }), 400

    new_status = data.get("status")

    if not isinstance(new_status, str):
        return jsonify({
            "error": "Order status is required."
        }), 400

    new_status = new_status.strip().lower()

    if new_status not in VALID_ORDER_STATUSES:
        return jsonify({
            "error": "Invalid status. Use processing, shipped, delivered, or cancelled."
        }), 400

    for order in ORDERS:
        if order["orderId"] == order_id:
            order["status"] = new_status

            return jsonify({
                "message": "Order status updated successfully.",
                "order": order
            }), 200

    return jsonify({
        "error": "Order not found."
    }), 404


# -----------------------------
# Root Route
# -----------------------------

@app.get("/")
def home():
    return jsonify({
        "message": "MINIMART Flask API is running."
    }), 200


# -----------------------------
# Run Flask Server
# -----------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
