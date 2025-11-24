import React, { useState } from "react";
import { ShoppingCart, Trash2, Eye, LayoutGrid, List, Mic } from "lucide-react";

const CashierView = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Milk Tea");
  const [viewMode, setViewMode] = useState("grid");
  const [orderNumber] = useState(1024);

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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-slate-800 shadow-md border-b-2 border-slate-700">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BubblePOS</h1>
                <p className="text-xs text-gray-300">Cashier View</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
                <Mic className="w-4 h-4" />
                Voice
              </button>
              <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2 text-sm font-medium">
                <Eye className="w-4 h-4" />
                Access
              </button>
              <div className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Mike Chen</p>
                  <p className="text-xs text-gray-400">Cashier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 mb-6 p-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                      selectedCategory === category.name
                        ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg scale-105"
                        : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory}{" "}
                  <span className="text-pink-600">Selection</span>
                </h2>
                <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
                className={
                  viewMode === "grid" ? "grid grid-cols-3 gap-4" : "space-y-3"
                }
              >
                {currentItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className={`${
                      item.color
                    } rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-200 text-left border-2 border-white/20 ${
                      viewMode === "list" ? "flex items-center gap-4" : ""
                    }`}
                  >
                    <div
                      className={`text-5xl mb-3 ${
                        viewMode === "list" ? "mb-0" : ""
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xl mb-1">{item.name}</div>
                      <div className="text-sm opacity-90 mb-3">
                        {item.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 hover:bg-white/50 transition-all">
                          <span className="text-2xl font-bold">+</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Current Order
                  </h2>
                </div>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                  aria-label="Clear cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg px-3 py-2 mb-6 border border-pink-200">
                <div className="text-sm font-semibold text-gray-700">
                  Order #{orderNumber}
                </div>
              </div>

              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-10 h-10 text-pink-400" />
                    </div>
                    <p className="text-gray-600 font-semibold">
                      No items in order
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Select items to add to order
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.cartId}
                      className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 flex items-center justify-between border border-gray-200 hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600 font-semibold mt-0.5">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg ml-3 transition-all"
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
                  <div className="border-t-2 border-gray-200 pt-5 space-y-3 mb-6">
                    <div className="flex justify-between text-gray-700 font-medium">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ${getSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700 font-medium">
                      <span>Tax (8.5%)</span>
                      <span className="font-semibold">
                        ${getTax().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-2xl font-bold text-gray-900 pt-3 border-t-2 border-gray-300">
                      <span>Total</span>
                      <span className="text-pink-600">
                        ${getTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:via-pink-700 hover:to-pink-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                    💳 Process Payment
                  </button>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <button className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg font-semibold">
                      ⏸️ Hold
                    </button>
                    <button className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg font-semibold">
                      ✖️ Void
                    </button>
                  </div>
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
