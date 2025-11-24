import React, { useState } from "react";
import { ShoppingCart, Trash2, Eye, Mic } from "lucide-react";

const CashierView = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Milk Tea");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 shadow-md border-b-2 border-teal-700">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BubblePOS</h1>
                <p className="text-xs text-teal-100">Cashier</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm">
                <Mic className="w-4 h-4" />
                Voice
              </button>
              <button className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors flex items-center gap-2 text-sm font-medium">
                <Eye className="w-4 h-4" />
                Access
              </button>
              <div className="flex items-center gap-2 bg-teal-700 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-teal-600 text-xs font-bold">MC</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Mike Chen</p>
                  <p className="text-xs text-teal-100">Cashier</p>
                </div>
              </div>
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap text-sm ${
                      selectedCategory === category.name
                        ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 border border-gray-200"
                    }`}
                  >
                    <span className="text-base">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
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
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-base mb-1">
                        {item.name}
                      </div>
                      <div className="text-xs opacity-90 mb-2">
                        {item.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="w-7 h-7 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 hover:bg-white/50 transition-all">
                          <span className="text-lg font-bold leading-none">
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
                  <h2 className="text-base font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
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
                <div className="text-xs font-semibold text-teal-700">
                  Order #{orderNumber}
                </div>
              </div>

              <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingCart className="w-8 h-8 text-teal-500" />
                    </div>
                    <p className="text-gray-600 font-medium text-sm">
                      No items in order
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
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
                        <div className="font-semibold text-gray-900 text-sm">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
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
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ${getSubtotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span>Tax (8.5%)</span>
                      <span className="font-semibold">
                        ${getTax().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                        ${getTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3.5 rounded-lg font-bold text-base hover:from-teal-600 hover:to-blue-600 transition-colors shadow-lg hover:shadow-xl">
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
