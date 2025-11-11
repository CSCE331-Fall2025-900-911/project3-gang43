import React, { useState } from 'react';
import { ShoppingCart, Trash2, Eye, LayoutGrid, List } from 'lucide-react';

const CashierView = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Milk Tea');
  const [viewMode, setViewMode] = useState('grid');
  const [orderNumber] = useState(1024);

  const categories = [
    { name: 'Milk Tea', icon: '🧋' },
    { name: 'Fruit Tea', icon: '🍹' },
    { name: 'Smoothies', icon: '🥤' },
    { name: 'Coffee', icon: '☕' },
    { name: 'Toppings', icon: '⭐' },
    { name: 'Snacks', icon: '🍪' }
  ];

  const menuItems = {
    'Milk Tea': [
      { id: 1, name: 'Classic Milk Tea', description: 'Traditional black tea with milk', price: 4.50, color: 'bg-gradient-to-br from-pink-400 to-pink-500', icon: '☕' },
      { id: 2, name: 'Taro Milk Tea', description: 'Creamy taro flavor with milk', price: 5.25, color: 'bg-gradient-to-br from-purple-400 to-purple-600', icon: '🧃' },
      { id: 3, name: 'Thai Milk Tea', description: 'Spiced tea with condensed milk', price: 4.75, color: 'bg-gradient-to-br from-orange-400 to-orange-500', icon: '☕' },
      { id: 4, name: 'Matcha Milk Tea', description: 'Premium matcha with creamy milk', price: 5.50, color: 'bg-gradient-to-br from-green-400 to-green-500', icon: '🍃' },
      { id: 5, name: 'Brown Sugar Milk Tea', description: 'Rich brown sugar syrup', price: 6.00, color: 'bg-gradient-to-br from-amber-600 to-amber-700', icon: '☕' },
      { id: 6, name: 'Hokkaido Milk Tea', description: 'Premium Hokkaido milk', price: 5.75, color: 'bg-gradient-to-br from-blue-400 to-blue-500', icon: '❄️' },
    ],
    'Fruit Tea': [
      { id: 7, name: 'Mango Tea', description: 'Fresh mango flavor', price: 5.00, color: 'bg-gradient-to-br from-yellow-400 to-orange-400', icon: '🥭' },
      { id: 8, name: 'Strawberry Tea', description: 'Sweet strawberry blend', price: 5.00, color: 'bg-gradient-to-br from-red-400 to-pink-400', icon: '🍓' },
      { id: 9, name: 'Passion Fruit Tea', description: 'Tropical passion fruit', price: 5.25, color: 'bg-gradient-to-br from-orange-400 to-yellow-400', icon: '🍊' },
    ],
    'Smoothies': [
      { id: 10, name: 'Berry Smoothie', description: 'Mixed berry blend', price: 6.50, color: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: '🫐' },
      { id: 11, name: 'Mango Smoothie', description: 'Tropical mango', price: 6.00, color: 'bg-gradient-to-br from-yellow-400 to-orange-400', icon: '🥭' },
    ],
    'Coffee': [
      { id: 12, name: 'Espresso', description: 'Strong espresso shot', price: 3.50, color: 'bg-gradient-to-br from-amber-700 to-amber-900', icon: '☕' },
      { id: 13, name: 'Latte', description: 'Smooth milk coffee', price: 4.50, color: 'bg-gradient-to-br from-amber-600 to-amber-700', icon: '☕' },
    ],
    'Toppings': [
      { id: 14, name: 'Boba Pearls', description: 'Classic tapioca pearls', price: 0.75, color: 'bg-gradient-to-br from-gray-700 to-gray-800', icon: '⚫' },
      { id: 15, name: 'Pudding', description: 'Creamy egg pudding', price: 1.00, color: 'bg-gradient-to-br from-yellow-300 to-yellow-400', icon: '🍮' },
    ],
    'Snacks': [
      { id: 16, name: 'Popcorn Chicken', description: 'Crispy chicken bites', price: 5.50, color: 'bg-gradient-to-br from-orange-500 to-red-500', icon: '🍗' },
    ]
  };

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now(), quantity: 1 }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">B</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">BubblePOS</h1>
                <p className="text-sm text-gray-500">Downtown Store - Terminal #1</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Accessibility
              </button>
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">MC</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Mike Chen</p>
                  <p className="text-xs text-gray-500">Cashier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <div className="bg-white rounded-xl shadow-sm mb-4 p-4">
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category.name
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCategory} Selection</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'space-y-3'}>
                {currentItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className={`${item.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-left ${
                      viewMode === 'list' ? 'flex items-center gap-4' : ''
                    }`}
                  >
                    <div className={`text-5xl mb-2 ${viewMode === 'list' ? 'mb-0' : ''}`}>{item.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold text-lg mb-1">{item.name}</div>
                      <div className="text-sm opacity-90 mb-2">{item.description}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">${item.price.toFixed(2)}</div>
                        <div className="w-8 h-8 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                          <span className="text-xl">+</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-pink-600" />
                  <h2 className="text-xl font-bold text-gray-900">Current Order</h2>
                </div>
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Clear cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">Order #{orderNumber}</div>

              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No items in order</p>
                    <p className="text-sm text-gray-400 mt-1">Select items to add to order</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.cartId} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">${item.price.toFixed(2)}</div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-red-500 hover:text-red-700 ml-3"
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
                  <div className="border-t pt-4 space-y-2 mb-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Tax (8.5%)</span>
                      <span>${getTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>${getTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg">
                    💳 Process Payment
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <button className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                      ⏸️ Hold
                    </button>
                    <button className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
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
