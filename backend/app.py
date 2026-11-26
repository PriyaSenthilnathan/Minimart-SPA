
from flask import Flask, jsonify, request
from time import sleep
from itertools import count
import re
from products import PRODUCTS

app = Flask(__name__)

# In-memory Order Storage
ORDERS = []
order_counter = count(1001)

VALID_ORDER_STATUSES = {
    "processing",
    "shipped",
    "delivered",
    "cancelled"
}


# Helper: Find a Product
def find_product(product_id):
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product

    return None


# GET: Retrieve All Products
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


# POST: Create a New Order
@app.post("/api/orders")
def create_order():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Request body must contain valid JSON."
        }), 400

    customer = data.get("customer")
    email = data.get("email")
    phone = data.get("phone")
    address = data.get("address")
    city = data.get("city")
    pincode = data.get("pincode")
    items = data.get("items")

    # Validate customer name
    if not isinstance(customer, str) or len(customer.strip()) < 2:
        return jsonify({
            "error": "Customer name must contain at least 2 characters."
        }), 400

    customer = customer.strip()

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

    # Validate phone number
    if not isinstance(phone, str):
        return jsonify({
            "error": "A valid phone number is required."
        }), 400

    phone = phone.strip()

    if not re.fullmatch(r"[0-9+\-\s()]{7,15}", phone):
        return jsonify({
            "error": "Please enter a valid phone number."
        }), 400

    # Validate delivery address
    if not isinstance(address, str) or len(address.strip()) < 5:
        return jsonify({
            "error": "Delivery address must contain at least 5 characters."
        }), 400

    address = address.strip()

    # Validate city
    if not isinstance(city, str) or not city.strip():
        return jsonify({
            "error": "City is required."
        }), 400

    city = city.strip()

    # Validate PIN code
    if not isinstance(pincode, str) or not re.fullmatch(r"[0-9]{6}", pincode.strip()):
        return jsonify({
            "error": "Please enter a valid 6-digit PIN code."
        }), 400

    pincode = pincode.strip()

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
        "customer": customer,
        "email": email,
        "phone": phone,
        "address": address,
        "city": city,
        "pincode": pincode,
        "items": order_items,
        "total": total,
        "status": "processing"
    }

    ORDERS.append(new_order)

    return jsonify({
        "message": "Order placed successfully.",
        "order": new_order
    }), 201


# PATCH: Update Order Status
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


# Root Route
@app.get("/")
def home():
    return jsonify({
        "message": "MINIMART Flask API is running."
    }), 200


# Run Flask Server
if __name__ == "__main__":
    app.run(debug=True, port=5000)
