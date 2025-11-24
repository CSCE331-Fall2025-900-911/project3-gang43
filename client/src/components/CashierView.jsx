import React, { useState, useEffect } from "react";
import { ShoppingCart, Trash2, Eye, Mic } from "lucide-react";

const CashierView = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Milk Tea");
  const [orderNumber] = useState(1024);
  const [zoomLevel, setZoomLevel] = useState(100);

  const increaseZoom = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const decreaseZoom = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 80));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${zoomLevel}%`;
  }, [zoomLevel]);

  const categories = [
    { name: "Milk Tea", icon: "🧋" },
    { name: "Fruit Tea", icon: "🍹" },
    { name: "Smoothies", icon: "🥤" },
    { name: "Coffee", icon: "☕" },
    { name: "Toppings", icon: "⭐" },
    { name: "Snacks", icon: "🍪" },
  ];

  const menuItems = {
    "Milk Tea": [
      {
        id: 1,
        name: "Classic Milk Tea",
        description: "Traditional black tea with milk",
        price: 4.5,
        color: "bg-gradient-to-br from-pink-400 to-pink-500",
        icon: "☕",
      },
      {
        id: 2,
        name: "Taro Milk Tea",
        description: "Creamy taro flavor with milk",
        price: 5.25,
        color: "bg-gradient-to-br from-purple-400 to-purple-600",
        icon: "🧃",
      },
      {
        id: 3,
        name: "Thai Milk Tea",
        description: "Spiced tea with condensed milk",
        price: 4.75,
        color: "bg-gradient-to-br from-orange-400 to-orange-500",
        icon: "☕",
      },
      {
        id: 4,
        name: "Matcha Milk Tea",
        description: "Premium matcha with creamy milk",
        price: 5.5,
        color: "bg-gradient-to-br from-green-400 to-green-500",
        icon: "🍃",
      },
      {
        id: 5,
        name: "Brown Sugar Milk Tea",
        description: "Rich brown sugar syrup",
        price: 6.0,
        color: "bg-gradient-to-br from-amber-600 to-amber-700",
        icon: "☕",
      },
      {
        id: 6,
        name: "Hokkaido Milk Tea",
        description: "Premium Hokkaido milk",
        price: 5.75,
        color: "bg-gradient-to-br from-blue-400 to-blue-500",
        icon: "❄️",
      },
    ],
    "Fruit Tea": [
      {
        id: 7,
        name: "Mango Tea",
        description: "Fresh mango flavor",
        price: 5.0,
        color: "bg-gradient-to-br from-yellow-400 to-orange-400",
        icon: "🥭",
      },
      {
        id: 8,
        name: "Strawberry Tea",
        description: "Sweet strawberry blend",
        price: 5.0,
        color: "bg-gradient-to-br from-red-400 to-pink-400",
        icon: "🍓",
      },
      {
        id: 9,
        name: "Passion Fruit Tea",
        description: "Tropical passion fruit",
        price: 5.25,
        color: "bg-gradient-to-br from-orange-400 to-yellow-400",
        icon: "🍊",
      },
    ],
    Smoothies: [
      {
        id: 10,
        name: "Berry Smoothie",
        description: "Mixed berry blend",
        price: 6.5,
        color: "bg-gradient-to-br from-purple-500 to-pink-500",
        icon: "🫐",
      },
      {
        id: 11,
        name: "Mango Smoothie",
        description: "Tropical mango",
        price: 6.0,
        color: "bg-gradient-to-br from-yellow-400 to-orange-400",
        icon: "🥭",
      },
    ],
    Coffee: [
      {
        id: 12,
        name: "Espresso",
        description: "Strong espresso shot",
        price: 3.5,
        color: "bg-gradient-to-br from-amber-700 to-amber-900",
        icon: "☕",
      },
      {
        id: 13,
        name: "Latte",
        description: "Smooth milk coffee",
        price: 4.5,
        color: "bg-gradient-to-br from-amber-600 to-amber-700",
        icon: "☕",
      },
    ],
    Toppings: [
      {
        id: 14,
        name: "Boba Pearls",
        description: "Classic tapioca pearls",
        price: 0.75,
        color: "bg-gradient-to-br from-gray-700 to-gray-800",
        icon: "⚫",
      },
      {
        id: 15,
        name: "Pudding",
        description: "Creamy egg pudding",
        price: 1.0,
        color: "bg-gradient-to-br from-yellow-300 to-yellow-400",
        icon: "🍮",
      },
    ],
    Snacks: [
      {
        id: 16,
        name: "Popcorn Chicken",
        description: "Crispy chicken bites",
        price: 5.5,
        color: "bg-gradient-to-br from-orange-500 to-red-500",
        icon: "🍗",
      },
    ],
  };

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now(), quantity: 1 }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.085;
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const currentItems = menuItems[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 shadow-md border-b-2 border-teal-700">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span
                  className="text-white font-bold"
                  style={{ fontSize: "1.25rem" }}
                >
                  B
                </span>
              </div>
              <div>
                <h1
                  className="font-bold text-white"
                  style={{ fontSize: "1.25rem" }}
                >
                  BubblePOS Kiosk
                </h1>
                <p className="text-teal-100" style={{ fontSize: "0.75rem" }}>
                  Terminal #1 • Downtown Store
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-teal-700 px-2 py-1.5 rounded-lg">
                <button
                  onClick={decreaseZoom}
                  className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white font-bold transition-colors"
                  style={{ fontSize: "0.875rem" }}
                  aria-label="Decrease text size"
                >
                  A-
                </button>
                <button
                  onClick={resetZoom}
                  className="px-2 py-1 text-white hover:bg-white/20 rounded transition-colors"
                  style={{ fontSize: "0.75rem" }}
                  aria-label="Reset text size"
                >
                  {zoomLevel}%
                </button>
                <button
                  onClick={increaseZoom}
                  className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white font-bold transition-colors"
                  style={{ fontSize: "0.875rem" }}
                  aria-label="Increase text size"
                >
                  A+
                </button>
              </div>
              <button
                className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors flex items-center gap-2 font-medium"
                style={{ fontSize: "0.875rem" }}
              >
                <Eye className="w-4 h-4" />
                Access
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow p-3 mb-4">
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      selectedCategory === category.name
                        ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-gray-200"
                    }`}
                    style={{ fontSize: "0.875rem" }}
                  >
                    <span style={{ fontSize: "1rem" }}>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
                  style={{ fontSize: "1.125rem" }}
                >
                  {selectedCategory}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {currentItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className={`${item.color} rounded-lg p-4 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all text-left`}
                  >
                    <div style={{ fontSize: "1.875rem" }} className="mb-2">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-semibold mb-1"
                        style={{ fontSize: "1rem" }}
                      >
                        {item.name}
                      </div>
                      <div
                        className="opacity-90 mb-2"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {item.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <div
                          className="font-bold"
                          style={{ fontSize: "1.25rem" }}
                        >
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="w-7 h-7 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 hover:bg-white/50 transition-all">
                          <span
                            className="font-bold leading-none"
                            style={{ fontSize: "1.125rem" }}
                          >
                            +
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <h2
                    className="font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
                    style={{ fontSize: "1rem" }}
                  >
                    Current Order
                  </h2>
                </div>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                  aria-label="Clear cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg px-3 py-2 mb-4 border border-teal-200">
                <div
                  className="font-semibold text-teal-700"
                  style={{ fontSize: "0.75rem" }}
                >
                  Order #{orderNumber}
                </div>
              </div>

              <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingCart className="w-8 h-8 text-teal-500" />
                    </div>
                    <p
                      className="text-gray-600 font-medium"
                      style={{ fontSize: "0.875rem" }}
                    >
                      No items in order
                    </p>
                    <p
                      className="text-gray-500 mt-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Select items to begin
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-3 flex items-center justify-between border-2 border-teal-200 hover:border-teal-300 transition-colors"
                    >
                      <div className="flex-1">
                        <div
                          className="font-semibold text-gray-900"
                          style={{ fontSize: "0.875rem" }}
                        >
                          {item.name}
                        </div>
                        <div
                          className="text-gray-600 mt-0.5"
                          style={{ fontSize: "0.75rem" }}
                        >
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 rounded ml-2 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <div className="border-t-2 border-gray-200 pt-4 space-y-2 mb-4">
                    <div
                      className="flex justify-between text-gray-700"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ${getSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div
                      className="flex justify-between text-gray-700"
                      style={{ fontSize: "0.875rem" }}
                    >
                      <span>Tax (8.5%)</span>
                      <span className="font-semibold">
                        ${getTax().toFixed(2)}
                      </span>
                    </div>
                    <div
                      className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200"
                      style={{ fontSize: "1.25rem" }}
                    >
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                        ${getTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3.5 rounded-lg font-bold hover:from-teal-600 hover:to-blue-600 transition-colors shadow-lg hover:shadow-xl"
                    style={{ fontSize: "1rem" }}
                  >
                    Process Payment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierView;
