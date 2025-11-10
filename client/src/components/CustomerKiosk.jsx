// ============================================
// FILE 2: CustomerKiosk.jsx
// ============================================

import React, { useState } from 'react';
import { Globe, ZoomIn, Eye, Trash2 } from 'lucide-react';

const CustomerKiosk = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('base');
  const [language, setLanguage] = useState('en');
  const [cart, setCart] = useState([]);

  // Sample menu items
  const menuItems = [
    { id: 1, name: 'Classic Milk Tea', price: 5.50, category: 'milk-tea', image: '🧋' },
    { id: 2, name: 'Taro Milk Tea', price: 6.00, category: 'milk-tea', image: '🧋' },
    { id: 3, name: 'Matcha Latte', price: 6.50, category: 'specialty', image: '🍵' },
    { id: 4, name: 'Fruit Tea', price: 5.00, category: 'fruit-tea', image: '🍹' },
    { id: 5, name: 'Brown Sugar Boba', price: 6.50, category: 'specialty', image: '🧋' },
    { id: 6, name: 'Thai Tea', price: 5.50, category: 'milk-tea', image: '🧋' },
    { id: 7, name: 'Mango Tea', price: 5.50, category: 'fruit-tea', image: '🍹' },
    { id: 8, name: 'Strawberry Tea', price: 5.50, category: 'fruit-tea', image: '🍹' },
  ];

  const addToCart = (item) => {
    setCart([...cart, { ...item, quantity: 1, id: Date.now() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  // Theme classes
  const bgClass = highContrast ? 'bg-black' : 'bg-gradient-to-br from-purple-50 to-pink-50';
  const cardBgClass = highContrast ? 'bg-gray-900 border-yellow-400 border-2' : 'bg-white';
  const textClass = highContrast ? 'text-yellow-300' : 'text-gray-900';
  const mutedTextClass = highContrast ? 'text-yellow-200' : 'text-gray-600';
  const buttonClass = highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-purple-600 text-white hover:bg-purple-700';
  const fontSizeClass = fontSize === 'large' ? 'text-xl' : fontSize === 'xlarge' ? 'text-2xl' : 'text-base';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-4xl font-bold ${textClass}`}>Welcome to Bubble Tea Shop</h1>
          <div className="flex gap-2">
            <button 
              className={`p-3 rounded ${cardBgClass} flex items-center gap-2 ${fontSizeClass}`}
              onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
              aria-label="Change language"
            >
              <Globe className="w-5 h-5" />
              {language === 'en' ? 'English' : 'Español'}
            </button>
            <button 
              className={`p-3 rounded ${cardBgClass}`} 
              onClick={() => setFontSize(fontSize === 'base' ? 'large' : fontSize === 'large' ? 'xlarge' : 'base')}
              aria-label="Adjust font size"
            >
              <ZoomIn className="w-6 h-6" />
            </button>
            <button 
              className={`p-3 rounded ${cardBgClass}`} 
              onClick={() => setHighContrast(!highContrast)}
              aria-label="Toggle high contrast mode"
            >
              <Eye className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-6">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className={`${cardBgClass} ${highContrast ? 'border-4 border-yellow-400' : 'border-2 border-gray-200'} rounded-xl p-6 hover:shadow-2xl transition-all`}
              aria-label={`Add ${item.name} for $${item.price.toFixed(2)}`}
            >
              <div className="text-6xl mb-4">{item.image}</div>
              <div className={`font-bold text-xl ${textClass} ${fontSizeClass}`}>{item.name}</div>
              <div className={`${mutedTextClass} text-2xl mt-2 font-semibold`}>${item.price.toFixed(2)}</div>
            </button>
          ))}
        </div>

        {cart.length > 0 && (
          <div className={`${cardBgClass} rounded-xl p-6 shadow-2xl`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${textClass}`}>Your Order</h2>
              <button 
                onClick={() => setCart([])}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2">
                    <span className={`${textClass} ${fontSizeClass}`}>{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className={`${mutedTextClass} ${fontSizeClass}`}>${item.price.toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-end">
                <div className="flex justify-between mb-4 pb-4 border-t-2 pt-4">
                  <span className={`text-2xl font-bold ${textClass}`}>Total:</span>
                  <span className={`text-2xl font-bold ${textClass}`}>${getTotal()}</span>
                </div>
                <button className={`w-full ${buttonClass} py-4 rounded-lg font-bold text-xl`}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerKiosk;
