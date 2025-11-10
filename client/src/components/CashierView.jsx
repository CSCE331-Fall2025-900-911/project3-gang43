import React, { useState } from 'react';
import { ShoppingCart, Sun, Moon, ZoomIn, Trash2 } from 'lucide-react';

const CashierView = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('base');
  const [cart, setCart] = useState([]);

  // Sample menu items
  const menuItems = [
    { id: 1, name: 'Classic Milk Tea', price: 5.50, category: 'milk-tea', image: '🧋' },
    { id: 2, name: 'Taro Milk Tea', price: 6.00, category: 'milk-tea', image: '🧋' },
    { id: 3, name: 'Matcha Latte', price: 6.50, category: 'specialty', image: '🍵' },
    { id: 4, name: 'Fruit Tea', price: 5.00, category: 'fruit-tea', image: '🍹' },
    { id: 5, name: 'Brown Sugar Boba', price: 6.50, category: 'specialty', image: '🧋' },
    { id: 6, name: 'Thai Tea', price: 5.50, category: 'milk-tea', image: '🧋' },
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
  const bgClass = highContrast ? 'bg-black' : 'bg-gray-50';
  const cardBgClass = highContrast ? 'bg-gray-900 border-yellow-400 border-2' : 'bg-white';
  const textClass = highContrast ? 'text-yellow-300' : 'text-gray-900';
  const mutedTextClass = highContrast ? 'text-yellow-200' : 'text-gray-600';
  const buttonClass = highContrast ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-blue-600 text-white hover:bg-blue-700';
  const fontSizeClass = fontSize === 'large' ? 'text-xl' : fontSize === 'xlarge' ? 'text-2xl' : 'text-base';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${textClass}`}>Cashier Terminal</h1>
          <div className="flex gap-2">
            <button 
              className={`p-2 rounded ${cardBgClass}`} 
              onClick={() => setFontSize(fontSize === 'base' ? 'large' : fontSize === 'large' ? 'xlarge' : 'base')}
              aria-label="Adjust font size"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button 
              className={`p-2 rounded ${cardBgClass}`} 
              onClick={() => setHighContrast(!highContrast)}
              aria-label="Toggle high contrast"
            >
              {highContrast ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className={`col-span-2 ${cardBgClass} rounded-lg p-6 shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-4 ${textClass}`}>Menu</h2>
            <div className="grid grid-cols-3 gap-4">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  className={`${cardBgClass} ${highContrast ? 'border-2 border-yellow-400' : 'border border-gray-200'} rounded-lg p-4 hover:shadow-lg transition-all ${fontSizeClass}`}
                  aria-label={`Add ${item.name} to cart`}
                >
                  <div className="text-4xl mb-2">{item.image}</div>
                  <div className={`font-semibold ${textClass}`}>{item.name}</div>
                  <div className={`${mutedTextClass} mt-1`}>${item.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className={`${cardBgClass} rounded-lg p-6 shadow-lg`}>
            <h2 className={`text-2xl font-semibold mb-4 ${textClass} flex items-center gap-2`}>
              <ShoppingCart className="w-6 h-6" />
              Current Order
            </h2>
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {cart.length === 0 ? (
                <p className={`${mutedTextClass} text-center py-8`}>No items in cart</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className={`${highContrast ? 'border-yellow-400 border' : 'border-gray-200 border'} rounded p-3`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`font-semibold ${textClass} ${fontSizeClass}`}>{item.name}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className={`${mutedTextClass} text-sm`}>
                      ${item.price.toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className={`border-t ${highContrast ? 'border-yellow-400' : 'border-gray-200'} pt-4 mt-4`}>
              <div className="flex justify-between mb-4">
                <span className={`text-xl font-bold ${textClass}`}>Total:</span>
                <span className={`text-xl font-bold ${textClass}`}>${getTotal()}</span>
              </div>
              <button className={`w-full ${buttonClass} py-3 rounded-lg font-semibold ${fontSizeClass}`}>
                Process Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierView;