import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Trash2, CreditCard, Sun, Moon, Search, Plus, Minus, Globe, ZoomIn, Eye, Volume2, AlertCircle, Check, X, Speaker, PlusCircle, Edit } from "lucide-react";
import GoogleTranslate from "./GoogleTranslate";
import { getAllProducts, getCategories, checkoutOrder, createProduct, updateProduct, deleteProduct, getInventory, getProductIngredients } from '../services/routes.js';
import { useWeatherDiscount } from "../hooks/useWeatherDiscount";
import WeatherWidget from "./WeatherWidget";
import VoiceControlPanel from "./VoiceControlPanel";
import useVoiceControl from "../hooks/useVoiceControl";
import useTextToSpeech from "../hooks/useTextToSpeech";


const CashierView = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [orderNumber] = useState(Math.floor(1000 + Math.random() * 9000));
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState("base");
  const [highContrast, setHighContrast] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [inventoryWarnings, setInventoryWarnings] = useState([]);
  const [commandFeedback, setCommandFeedback] = useState(null);
  const [lastCommand, setLastCommand] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showManageMode, setShowManageMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_name: '',
    category: '',
    price: '',
    icon: '🥤',
    description: ''
  });

  const {
    discountPercent,
    discountMessage,
    loading: weatherLoading,
    error: weatherError,
    fetchWeatherByLocation
  } = useWeatherDiscount('College Station');
  
  const { user } = useAuth();
  const displayName = user?.name || 'Demo Cashier';
  const initials = displayName
  .trim()
  .split(' ')
  .filter(word => word.length > 0)
  .map(word => word[0])
  .join('')
  .toUpperCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesResponse, productsResponse, inventoryResponse] = await Promise.all([
          getCategories(),
          getAllProducts(),
          getInventory()
        ]);

        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
          if (categoriesResponse.data.length > 0) {
            setSelectedCategory(categoriesResponse.data[0]);
          }
        }

        if (productsResponse.success) {
          setProducts(productsResponse.data);
        }

        if (inventoryResponse.success) {
          setInventory(inventoryResponse.data);
        }
      } catch (err) {
        setError('Failed to load products. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [customizingItem, setCustomizingItem] = useState(null);
  const sugarOptions = ["0%", "30%", "50%", "70%", "100%", "120%"];
  const [sugarLevel, setSugarLevel] = useState("100%");
  const iceOptions = ["No Ice", "Light Ice", "Regular Ice", "Extra Ice", "Hot"];
  const sizeOptions = ["Small", "Medium", "Large"];
  const [drinkSize, setDrinkSize] = useState("Medium");
  const [iceLevel, setIceLevel] = useState("Regular Ice");
  const [selectedToppings, setSelectedToppings] = useState([]);

  const menuItems = {
    Toppings: [
      { id: 1, name: 'Boba', icon: '⚫', price: 0.5 },
      { id: 2, name: 'Pudding', icon: '🍮', price: 0.75 },
      { id: 3, name: 'Aloe', icon: '🌿', price: 0.5 },
      { id: 4, name: 'Grass Jelly', icon: '⚫', price: 0.75 },
      { id: 5, name: 'Lychee Jelly', icon: '⚪', price: 0.75 },
      { id: 6, name: 'Cheese Foam', icon: '🧀', price: 1.25 }
    ]
  };

  const isDrinkItem = (item) => {
    const drinkKeywords = ["Milk Tea", "Fruit Tea", "Smoothies", "Coffee", "Tea", "Slush"];
    return drinkKeywords.some(keyword => (item.category || "").includes(keyword));
  };

  const handleItemClick = (item) => {
    if (isDrinkItem(item)) {
      setCustomizingItem(item);
      setSugarLevel("100%");
      setIceLevel("Regular Ice");
      setSelectedToppings([]);
      setDrinkSize("Medium");
    } else {
      addToCart(item);
    }
  };

  const toggleTopping = (topping) => {
    setSelectedToppings(prev => {
      if (prev.some(t => t.id === topping.id)) return prev.filter(t => t.id !== topping.id);
      return [...prev, topping];
    });
  };

  const addToCart = (item, customizations = null) => {
    let finalPrice = Number(item.price);

    if (customizations && customizations.size) {
        if (customizations.size === "Small") {
            finalPrice -= 0.50;   // Small: $0.50 less
        } else if (customizations.size === "Large") {
            finalPrice += 0.75;   // Large: $0.75 more
        }
    }


    if (customizations && customizations.toppings) {
      finalPrice += customizations.toppings.reduce((sum, t) => sum + t.price, 0);
    }

    const itemToAdd = {
      ...item,
      name: item.product_name || item.name,
      price: finalPrice,
      customizations: customizations,
      quantity: 1
    };

    const existingItemIndex = cart.findIndex(cartItem => 
      cartItem.product_id === item.product_id && 
      JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
    );

    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...itemToAdd, cartId: Date.now() }]);
    }

    setCustomizingItem(null);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, delta) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const getSubtotal = () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    return subtotal * discountPercent / 100;
  };
  const getDiscountedSubtotal = () => {
    const subtotal = getSubtotal();
    const discount = getDiscountAmount();
    return subtotal - discount;
  };
  const getTax = () => getDiscountedSubtotal() * 0.085;
  const getTotal = () => getDiscountedSubtotal() + getTax();

  const currentItems = selectedCategory 
    ? products.filter(item => item.category === selectedCategory)
    : [];
  
  const filteredItems = currentItems.filter(item =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFontSizeMultiplier = () => {
    if (fontSize === "large") return 1.2;
    if (fontSize === "xlarge") return 1.4;
    return 1;
  };

  const fontMultiplier = getFontSizeMultiplier();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setCheckoutMessage({ type: 'error', text: 'Cart is empty' });
      return;
    }

    setIsProcessing(true);
    setCheckoutMessage(null);
    setInventoryWarnings([]);

    try {
      const cartItems = cart.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        notes: item.customizations ?
          `Size: ${item.customizations.size}, Sugar: ${item.customizations.sugar}, Ice: ${item.customizations.ice}, Toppings: ${item.customizations.toppings.map(t=>t.name).join(', ')}`
          : ""
      }));

      const response = await checkoutOrder(
        cartItems,
        getTotal(),
        getSubtotal(),
        getTax(),
        displayName
      );

      if (response.success) {
        setInventoryWarnings(response.data.warnings || []);
        setCheckoutMessage({
          type: 'success',
          text: `Order #${response.data.orderId} processed successfully!`,
        });
        setCart([]);
        setTimeout(() => setCheckoutMessage(null), 3000);
      } else {
        setCheckoutMessage({
          type: 'error',
          text: response.message || 'Failed to process order',
        });
      }
    } catch (error) {
      setCheckoutMessage({
        type: 'error',
        text: 'Error processing order. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceCommand = useCallback((command) => {
    setLastCommand(command);
    const lowerCommand = command.toLowerCase();

    // Clear cart command
    if (lowerCommand.includes('clear cart') || lowerCommand.includes('empty cart')) {
      clearCart();
      setCommandFeedback({ success: true, message: 'Cart cleared' });
      return;
    }

    // Checkout command
    if (lowerCommand.includes('checkout') || lowerCommand.includes('place order') || lowerCommand.includes('complete order')) {
      handleCheckout();
      setCommandFeedback({ success: true, message: 'Processing checkout...' });
      return;
    }

    // Category selection
    const categoryMatch = categories.find(cat =>
      lowerCommand.includes(cat.toLowerCase())
    );
    if (categoryMatch) {
      setSelectedCategory(categoryMatch);
      setCommandFeedback({ success: true, message: `Showing ${categoryMatch}` });
      return;
    }

    // Show all items
    if (lowerCommand.includes('show all') || lowerCommand.includes('all items')) {
      setSelectedCategory(categories[0] || null);
      setCommandFeedback({ success: true, message: 'Showing all items' });
      return;
    }

    // Add item to cart
    if (lowerCommand.includes('add') || lowerCommand.includes('order') || lowerCommand.includes('want')) {
      const foundProduct = products.find(product => {
        const productName = product.product_name.toLowerCase();
        return lowerCommand.includes(productName) ||
               productName.split(' ').some(word => lowerCommand.includes(word));
      });

      if (foundProduct) {
        addToCart(foundProduct);
        setCommandFeedback({ success: true, message: `Added ${foundProduct.product_name} to cart` });
      } else {
        setCommandFeedback({ success: false, message: 'Product not found. Please try again.' });
      }
      return;
    }

    // Remove item from cart
    if (lowerCommand.includes('remove') || lowerCommand.includes('delete')) {
      const foundCartItem = cart.find(item => {
        const itemName = (item.name || item.product_name).toLowerCase();
        return lowerCommand.includes(itemName) ||
               itemName.split(' ').some(word => lowerCommand.includes(word));
      });

      if (foundCartItem) {
        removeFromCart(foundCartItem.cartId);
        setCommandFeedback({ success: true, message: `Removed ${foundCartItem.name || foundCartItem.product_name} from cart` });
      } else {
        setCommandFeedback({ success: false, message: 'Item not found in cart' });
      }
      return;
    }

    setCommandFeedback({ success: false, message: 'Command not recognized. Try "add [item name]" or "checkout"' });
  }, [cart, products, categories, selectedCategory]);

  const voiceControl = useVoiceControl({
    onCommand: handleVoiceCommand,
    enabled: false
  });

  const { speak, cancel, isSpeaking } = useTextToSpeech();

  const speakCustomization = useCallback(() => {
    if (!customizingItem) return;

    const toppingsText = selectedToppings.length > 0
      ? `with ${selectedToppings.map(t => t.name).join(', ')}`
      : 'with no toppings';

    const text = `Customizing ${customizingItem.product_name}. Size: ${drinkSize}. Sugar level: ${sugarLevel}. Ice level: ${iceLevel}. ${toppingsText}. Total price: $${(Number(customizingItem?.price || 0) + (drinkSize === "Small" ? -0.50 : drinkSize === "Large" ? 0.75 : 0) + selectedToppings.reduce((sum, t) => sum + Number(t.price || 0), 0)).toFixed(2)}`;

    speak(text);
  }, [customizingItem, drinkSize, sugarLevel, iceLevel, selectedToppings, speak]);

  const speakCartSummary = useCallback(() => {
    if (cart.length === 0) {
      speak('Your cart is empty.');
      return;
    }

    let text = `You have ${cart.length} item${cart.length > 1 ? 's' : ''} in your cart. `;

    cart.forEach((item, index) => {
      text += `Item ${index + 1}: ${item.quantity} ${item.name || item.product_name}`;
      if (item.customizations) {
        text += `, ${item.customizations.size} size, ${item.customizations.sugar} sugar, ${item.customizations.ice}`;
      }
      text += `. `;
    });

    text += `Subtotal: $${getSubtotal().toFixed(2)}. `;

    if (discountPercent > 0) {
      text += `Discount: ${discountPercent}% off, saving $${getDiscountAmount().toFixed(2)}. `;
    }

    text += `Tax: $${getTax().toFixed(2)}. Total: $${getTotal().toFixed(2)}.`;

    speak(text);
  }, [cart, discountPercent, getSubtotal, getDiscountAmount, getTax, getTotal, speak]);

  const handleAddProduct = async () => {
    if (!newProduct.product_name || !newProduct.category || !newProduct.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await createProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        ingredients: selectedIngredients
      });

      if (response.success) {
        // Refresh products list
        const productsResponse = await getAllProducts();
        if (productsResponse.success) {
          setProducts(productsResponse.data);
        }

        // Reset form and close modal
        setNewProduct({
          product_name: '',
          category: '',
          price: '',
          icon: '🥤',
          description: ''
        });
        setSelectedIngredients([]);
        setShowAddProductModal(false);
        alert('Product added successfully!');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleEditProduct = async (product) => {
    setEditingProduct(product);
    setNewProduct({
      product_name: product.product_name,
      category: product.category,
      price: product.price.toString(),
      icon: product.icon || '🥤',
      description: product.description || ''
    });

    // Fetch ingredients for this product
    try {
      const response = await getProductIngredients(product.product_id);
      if (response.success) {
        setSelectedIngredients(response.data.map(ing => ({
          inventory_id: ing.inventory_id,
          quantity_needed: ing.quantity_needed
        })));
      }
    } catch (error) {
      console.error('Error fetching product ingredients:', error);
      setSelectedIngredients([]);
    }

    setShowEditProductModal(true);
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.product_name || !newProduct.category || !newProduct.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await updateProduct(editingProduct.product_id, {
        ...newProduct,
        price: parseFloat(newProduct.price),
        ingredients: selectedIngredients
      });

      if (response.success) {
        // Refresh products list
        const productsResponse = await getAllProducts();
        if (productsResponse.success) {
          setProducts(productsResponse.data);
        }

        // Reset form and close modal
        setNewProduct({
          product_name: '',
          category: '',
          price: '',
          icon: '🥤',
          description: ''
        });
        setSelectedIngredients([]);
        setEditingProduct(null);
        setShowEditProductModal(false);
        alert('Product updated successfully!');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const toggleIngredient = (inventoryId) => {
    setSelectedIngredients(prev => {
      const exists = prev.find(ing => ing.inventory_id === inventoryId);
      if (exists) {
        return prev.filter(ing => ing.inventory_id !== inventoryId);
      }
      return [...prev, { inventory_id: inventoryId, quantity_needed: 1 }];
    });
  };

  const updateIngredientQuantity = (inventoryId, quantity) => {
    setSelectedIngredients(prev => prev.map(ing =>
      ing.inventory_id === inventoryId
        ? { ...ing, quantity_needed: parseFloat(quantity) || 0 }
        : ing
    ));
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      const response = await deleteProduct(productId);

      if (response.success) {
        // Refresh products list
        const productsResponse = await getAllProducts();
        if (productsResponse.success) {
          setProducts(productsResponse.data);
        }
        alert('Product deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const theme = highContrast ? {
    bg: "#000000",
    card: "#1a1a1a",
    text: "#ffeb3b",
    textMuted: "#fdd835",
    border: "#ffeb3b",
    hover: "#333333",
    accent: "#ffeb3b",
  } : {
    bg: darkMode ? "#0f172a" : "#f8fafc",
    card: darkMode ? "#1e293b" : "#ffffff",
    text: darkMode ? "#f1f5f9" : "#0f172a",
    textMuted: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#e2e8f0",
    hover: darkMode ? "#334155" : "#f1f5f9",
    accent: "#3b82f6",
  };

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: "100vh", position: "relative" }}>
      <div style={{ backgroundColor: theme.card, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ padding: "1rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: `${50 * fontMultiplier}px`,
                height: `${50 * fontMultiplier}px`,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: `${1.5 * fontMultiplier}rem`,
                boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)"
              }}>
                B
              </div>
              <div>
                <h1 style={{ fontSize: `${1.25 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text, margin: 0 }}>Bubble POS</h1>
                <p style={{ fontSize: `${0.875 * fontMultiplier}rem`, color: theme.textMuted, margin: 0 }}>Downtown Store</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowManageMode(!showManageMode)}
                style={{
                  padding: `${0.625 * fontMultiplier}rem ${1 * fontMultiplier}rem`,
                  borderRadius: "10px",
                  border: "none",
                  background: showManageMode ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "600",
                  fontSize: `${0.875 * fontMultiplier}rem`,
                  boxShadow: showManageMode ? "0 2px 4px rgba(16, 185, 129, 0.3)" : "0 2px 4px rgba(99, 102, 241, 0.3)"
                }}
              >
                <Edit style={{ width: `${18 * fontMultiplier}px`, height: `${18 * fontMultiplier}px` }} />
                {showManageMode ? "Done Managing" : "Manage Products"}
              </button>

              {showManageMode && (
                <button
                  onClick={() => setShowAddProductModal(true)}
                  style={{
                    padding: `${0.625 * fontMultiplier}rem ${1 * fontMultiplier}rem`,
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "white",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: "600",
                    fontSize: `${0.875 * fontMultiplier}rem`,
                    boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)"
                  }}
                >
                  <PlusCircle style={{ width: `${18 * fontMultiplier}px`, height: `${18 * fontMultiplier}px` }} />
                  Add Drink
                </button>
              )}

              <button
                onClick={() => setFontSize(fontSize === "base" ? "large" : fontSize === "large" ? "xlarge" : "base")}
                style={{
                  padding: `${0.625 * fontMultiplier}rem ${1 * fontMultiplier}rem`,
                  borderRadius: "10px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.card,
                  color: theme.text,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "500",
                  fontSize: `${0.875 * fontMultiplier}rem`
                }}
              >
                <ZoomIn style={{ width: `${18 * fontMultiplier}px`, height: `${18 * fontMultiplier}px` }} />
                {fontSize === "base" ? "Zoom" : fontSize === "large" ? "Zoom+" : "Zoom++"}
              </button>

              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  if (highContrast) setHighContrast(false);
                }}
                style={{
                  padding: `${0.625 * fontMultiplier}rem ${1 * fontMultiplier}rem`,
                  borderRadius: "10px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.card,
                  color: theme.text,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "500",
                  fontSize: `${0.875 * fontMultiplier}rem`
                }}
              >
                {darkMode ? <Sun style={{ width: `${18 * fontMultiplier}px`, height: `${18 * fontMultiplier}px` }} /> : <Moon style={{ width: `${18 * fontMultiplier}px`, height: `${18 * fontMultiplier}px` }} />}
              </button>

              <button
                onClick={() => {
                  setHighContrast(!highContrast);
                  if (!highContrast) setDarkMode(false);
                }}
                style={{
                  padding: `${0.625 * fontMultiplier}rem ${1 * fontMultiplier}rem`,
                  borderRadius: "10px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: highContrast ? "#ffeb3b" : theme.card,
                  color: highContrast ? "#000" : theme.text,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "500",
                  fontSize: `${0.875 * fontMultiplier}rem`
                }}
              >
                <Eye style={{ width: `${18 * fontMultiplier}px`, height: `${18 * fontMultiplier}px` }} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingLeft: "0.75rem", borderLeft: `1px solid ${theme.border}` }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>{user?.name || 'Demo Cashier'}</div>
                  <div style={{ fontSize: `${0.75 * fontMultiplier}rem`, color: theme.textMuted }}>{user?.role || 'Cashier'}</div>
                </div>
                <div style={{
                  width: `${40 * fontMultiplier}px`,
                  height: `${40 * fontMultiplier}px`,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  border: "2px solid #3b82f6"
                }}>
                    {initials}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {discountPercent > 0 && !weatherLoading && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: `${0.75 * fontMultiplier}rem ${1.5 * fontMultiplier}rem`,
          borderRadius: '12px',
          margin: `0 ${1.5 * fontMultiplier}rem`,
          textAlign: 'center',
          fontSize: `${0.875 * fontMultiplier}rem`,
          fontWeight: '600',
          boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)',
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          🎉 {discountMessage || `${discountPercent}% Weather Discount Active!`}
        </div>
      )}

      <div style={{ padding: `${1.5 * fontMultiplier}rem`, display: "grid", gridTemplateColumns: "250px 1fr 350px", gap: `${1.5 * fontMultiplier}rem` }}>
        <div>
          <div style={{ backgroundColor: theme.card, borderRadius: "16px", border: `1px solid ${theme.border}`, overflow: "hidden" }}>
            <div style={{ padding: `${1.25 * fontMultiplier}rem`, borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                CATEGORIES
              </h3>
            </div>
            <div style={{ padding: `${0.75 * fontMultiplier}rem` }}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: `${0.875 * fontMultiplier}rem ${1 * fontMultiplier}rem`,
                    borderRadius: "10px",
                    border: "none",
                    marginBottom: "0.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    fontWeight: "500",
                    fontSize: `${0.9375 * fontMultiplier}rem`,
                    backgroundColor: selectedCategory === category ? "#3b82f6" : "transparent",
                    color: selectedCategory === category ? "white" : theme.text,
                    transform: selectedCategory === category ? "translateX(4px)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.backgroundColor = theme.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ backgroundColor: theme.card, borderRadius: "16px", border: `1px solid ${theme.border}`, padding: `${1.5 * fontMultiplier}rem` }}>
            <div style={{ marginBottom: `${1.5 * fontMultiplier}rem` }}>
              <h2 style={{ fontSize: `${1.75 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text, marginBottom: "1rem" }}>
                {selectedCategory || "All Items"}
              </h2>

              <div style={{ position: "relative" }}>
                <Search style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: theme.textMuted, width: `${20 * fontMultiplier}px`, height: `${20 * fontMultiplier}px` }} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: `${0.75 * fontMultiplier}rem ${1 * fontMultiplier}rem ${0.75 * fontMultiplier}rem ${3 * fontMultiplier}rem`,
                    borderRadius: "10px",
                    border: `1px solid ${theme.border}`,
                    backgroundColor: highContrast ? "#000" : (darkMode ? "#0f172a" : "#f8fafc"),
                    color: theme.text,
                    fontSize: `${0.9375 * fontMultiplier}rem`,
                    outline: "none"
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
              {loading ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: theme.textMuted }}>
                  Loading products...
                </div>
              ) : error ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: "#ef4444" }}>
                  {error}
                </div>
              ) : filteredItems.length === 0 ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem", color: theme.textMuted }}>
                  No products found in this category
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.product_id}
                    style={{ position: "relative" }}
                  >
                    <button
                      onClick={() => !showManageMode && handleItemClick(item)}
                      style={{
                        width: "100%",
                        backgroundColor: highContrast ? "#1a1a1a" : (darkMode ? "#1e293b" : "white"),
                        border: `2px solid ${theme.border}`,
                        borderRadius: "16px",
                        padding: `${1.25 * fontMultiplier}rem`,
                        cursor: showManageMode ? "default" : "pointer",
                        transition: "all 0.2s",
                        textAlign: "center",
                        opacity: showManageMode ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!showManageMode) {
                          e.currentTarget.style.transform = "translateY(-4px)";
                          e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(59, 130, 246, 0.4)`;
                          e.currentTarget.style.borderColor = "#3b82f6";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!showManageMode) {
                          e.currentTarget.style.transform = "none";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.borderColor = theme.border;
                        }
                      }}
                    >
                      <div style={{
                        fontSize: `${3 * fontMultiplier}rem`,
                        marginBottom: "0.75rem",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                      }}>
                        {item.icon || "☕"}
                      </div>
                      <h3 style={{
                        fontSize: `${0.9375 * fontMultiplier}rem`,
                        fontWeight: "600",
                        color: theme.text,
                        marginBottom: "0.25rem",
                        lineHeight: "1.3"
                      }}>
                        {item.product_name}
                      </h3>
                      <p style={{
                        fontSize: `${0.75 * fontMultiplier}rem`,
                        color: theme.textMuted,
                        marginBottom: "0.75rem",
                        lineHeight: "1.4"
                      }}>
                        {item.description || item.size}
                      </p>
                      <div style={{
                        fontSize: `${1.25 * fontMultiplier}rem`,
                        fontWeight: "bold",
                        color: "#3b82f6"
                      }}>
                        ${Number(item.price).toFixed(2)}
                      </div>
                    </button>
                    {showManageMode && (
                      <>
                        <button
                          onClick={() => handleEditProduct(item)}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "48px",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "none",
                            background: "#3b82f6",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#2563eb";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#3b82f6";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.product_id, item.product_name)}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            border: "none",
                            background: "#ef4444",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#dc2626";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ef4444";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div style={{ marginBottom: `${1.5 * fontMultiplier}rem` }}>
            <WeatherWidget showCitySearch={false} />
          </div>

          <div style={{ backgroundColor: theme.card, borderRadius: "16px", border: `1px solid ${theme.border}`, padding: `${1.25 * fontMultiplier}rem`, position: "sticky", top: `${1.5 * fontMultiplier}rem` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: `${1.125 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text, margin: 0 }}>Current Order</h2>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {cart.length > 0 && (
                  <button
                    onClick={speakCartSummary}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "8px",
                      border: `1px solid ${theme.border}`,
                      backgroundColor: isSpeaking ? "#3b82f6" : "transparent",
                      color: isSpeaking ? "white" : theme.text,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseEnter={(e) => {
                      if (!isSpeaking) e.currentTarget.style.backgroundColor = theme.hover;
                    }}
                    onMouseLeave={(e) => {
                      if (!isSpeaking) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    title="Read order summary aloud"
                  >
                    <Speaker style={{ width: `${18 * fontMultiplier}px`, height: `${18 * fontMultiplier}px` }} />
                  </button>
                )}
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "transparent",
                      color: "#ef4444",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <Trash2 style={{ width: `${18 * fontMultiplier}px`, height: `${18 * fontMultiplier}px` }} />
                  </button>
                )}
              </div>
            </div>

            <div style={{
              backgroundColor: highContrast ? "#333" : (darkMode ? "#0f172a" : "#f0f9ff"),
              padding: `${0.75 * fontMultiplier}rem ${1 * fontMultiplier}rem`,
              borderRadius: "10px",
              marginBottom: "1rem",
              border: `1px solid ${highContrast ? theme.accent : (darkMode ? "#1e40af" : "#bfdbfe")}`
            }}>
              <div style={{ fontSize: `${0.75 * fontMultiplier}rem`, fontWeight: "600", color: highContrast ? theme.accent : (darkMode ? "#93c5fd" : "#1e40af") }}>
                Order #{orderNumber}
              </div>
            </div>

            <div style={{ maxHeight: "320px", overflowY: "auto", marginBottom: "1rem" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: `${3 * fontMultiplier}rem 0` }}>
                  <div style={{
                    width: `${80 * fontMultiplier}px`,
                    height: `${80 * fontMultiplier}px`,
                    borderRadius: "50%",
                    background: highContrast ? "#333" : (darkMode ? "rgba(59, 130, 246, 0.1)" : "#f0f9ff"),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem"
                  }}>
                    <ShoppingCart style={{ width: `${40 * fontMultiplier}px`, height: `${40 * fontMultiplier}px`, color: theme.accent }} />
                  </div>
                  <p style={{ color: theme.textMuted, fontSize: `${0.875 * fontMultiplier}rem`, margin: 0 }}>No items in cart</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {cart.map((item) => (
                    <div
                      key={item.cartId}
                      style={{
                        backgroundColor: highContrast ? "#1a1a1a" : (darkMode ? "#0f172a" : "#f8fafc"),
                        padding: `${0.75 * fontMultiplier}rem`,
                        borderRadius: "10px",
                        border: `1px solid ${theme.border}`
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>{item.name || item.product_name}</div>
                          {item.customizations && (
                            <div style={{ fontSize: `${0.75 * fontMultiplier}rem`, color: theme.textMuted, marginTop: "0.25rem" }}>
                              <div>Size: {item.customizations.size} • Sugar: {item.customizations.sugar} • Ice: {item.customizations.ice}</div>
                              {item.customizations.toppings.length > 0 && (
                                <div>+ {item.customizations.toppings.map(t => t.name).join(", ")}</div>
                              )}
                            </div>
                          )}
                          <div style={{ fontSize: `${0.8125 * fontMultiplier}rem`, color: theme.textMuted }}>${Number(item.price).toFixed(2)}</div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          style={{
                            padding: "0.25rem",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "#ef4444",
                            cursor: "pointer"
                          }}
                        >
                          <Trash2 style={{ width: `${16 * fontMultiplier}px`, height: `${16 * fontMultiplier}px` }} />
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                          onClick={() => updateQuantity(item.cartId, -1)}
                          style={{
                            width: `${32 * fontMultiplier}px`,
                            height: `${32 * fontMultiplier}px`,
                            borderRadius: "8px",
                            border: `1px solid ${theme.border}`,
                            backgroundColor: theme.card,
                            color: theme.text,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: `${1.125 * fontMultiplier}rem`,
                            fontWeight: "bold"
                          }}
                        >
                          −
                        </button>
                        <div style={{
                          flex: 1,
                          textAlign: "center",
                          fontSize: `${0.9375 * fontMultiplier}rem`,
                          fontWeight: "600",
                          color: theme.text,
                          padding: "0.5rem"
                        }}>
                          {item.quantity}
                        </div>
                        <button
                          onClick={() => updateQuantity(item.cartId, 1)}
                          style={{
                            width: `${32 * fontMultiplier}px`,
                            height: `${32 * fontMultiplier}px`,
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: highContrast ? theme.accent : "#3b82f6",
                            color: highContrast ? "#000" : "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: `${1.125 * fontMultiplier}rem`,
                            fontWeight: "bold"
                          }}
                        >
                          +
                        </button>
                        <div style={{
                          fontSize: `${0.9375 * fontMultiplier}rem`,
                          fontWeight: "bold",
                          color: theme.text,
                          minWidth: "70px",
                          textAlign: "right"
                        }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <>
                <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: "1rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: `${0.875 * fontMultiplier}rem`, color: theme.textMuted }}>Subtotal</span>
                    <span style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>${getSubtotal().toFixed(2)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{
                        fontSize: `${0.875 * fontMultiplier}rem`,
                        color: "#10b981",
                        fontWeight: "600"
                      }}>
                        {discountMessage || `${discountPercent}% Weather Discount`}
                      </span>
                      <span style={{
                        fontSize: `${0.875 * fontMultiplier}rem`,
                        fontWeight: "600",
                        color: "#10b981"
                      }}>
                        -${getDiscountAmount().toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: `${0.875 * fontMultiplier}rem`, color: theme.textMuted }}>Tax (8.5%)</span>
                    <span style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>${getTax().toFixed(2)}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "0.75rem",
                    borderTop: `1px solid ${theme.border}`
                  }}>
                    <span style={{ fontSize: `${1 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text }}>Total</span>
                    <span style={{ fontSize: `${1.25 * fontMultiplier}rem`, fontWeight: "bold", color: highContrast ? theme.accent : "#3b82f6" }}>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                {checkoutMessage && (
                  <div style={{
                    padding: `${0.75 * fontMultiplier}rem`,
                    borderRadius: "10px",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: checkoutMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: checkoutMessage.type === 'success' ? '#166534' : '#991b1b',
                    border: `1px solid ${checkoutMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                  }}>
                    <AlertCircle style={{ width: `${18 * fontMultiplier}px`, height: `${18 * fontMultiplier}px` }} />
                    <span style={{ fontSize: `${0.875 * fontMultiplier}rem` }}>{checkoutMessage.text}</span>
                  </div>
                )}

                {inventoryWarnings.length > 0 && (
                  <div style={{
                    padding: `${0.75 * fontMultiplier}rem`,
                    borderRadius: "10px",
                    marginBottom: "1rem",
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fcd34d',
                  }}>
                    <div style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: '#92400e', marginBottom: "0.5rem" }}>
                      ⚠️ Inventory Warnings:
                    </div>
                    {inventoryWarnings.map((warning, idx) => (
                      <div key={idx} style={{ fontSize: `${0.8125 * fontMultiplier}rem`, color: '#b45309', marginBottom: "0.25rem" }}>
                        • {warning.ingredient}: {warning.message}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  style={{
                    width: "100%",
                    padding: `${0.875 * fontMultiplier}rem`,
                    borderRadius: "10px",
                    border: "none",
                    background: isProcessing ? '#cbd5e1' : (highContrast ? theme.accent : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"),
                    color: isProcessing ? '#64748b' : (highContrast ? "#000" : "white"),
                    fontWeight: "bold",
                    fontSize: `${1 * fontMultiplier}rem`,
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.2s",
                    boxShadow: highContrast ? "none" : (isProcessing ? "none" : "0 4px 6px -1px rgba(59, 130, 246, 0.3)"),
                    opacity: isProcessing ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!highContrast && !isProcessing) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(59, 130, 246, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!highContrast && !isProcessing) {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(59, 130, 246, 0.3)";
                    }
                  }}
                >
                  <CreditCard style={{ width: `${20 * fontMultiplier}px`, height: `${20 * fontMultiplier}px` }} />
                  {isProcessing ? "Processing..." : "Process Payment"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {customizingItem && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000 
        }}>
          <div style={{
            backgroundColor: theme.card,
            borderRadius: "16px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: `1px solid ${theme.border}`,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}>
            <div style={{
              padding: "1.5rem",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ fontSize: "2.5rem" }}>{customizingItem?.icon || "🥤"}</div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: theme.text, margin: 0 }}>
                    {customizingItem?.name || customizingItem?.product_name}
                  </h3>
                  <p style={{ color: theme.textMuted, margin: 0 }}>${Number(customizingItem?.price || 0).toFixed(2)}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={speakCustomization}
                  style={{
                    background: isSpeaking ? "#3b82f6" : "transparent",
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                    color: isSpeaking ? "white" : theme.text,
                    cursor: "pointer",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                  }}
                  title="Read customization aloud"
                >
                  <Speaker size={20} />
                </button>
                <button
                  onClick={() => {
                    cancel();
                    setCustomizingItem(null);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: theme.textMuted,
                    cursor: "pointer",
                    padding: "0.5rem"
                  }}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", color: theme.text, marginBottom: "1rem" }}>Sugar Level</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                  {sugarOptions.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSugarLevel(level)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: sugarLevel === level ? "2px solid #3b82f6" : `1px solid ${theme.border}`,
                        backgroundColor: sugarLevel === level ? (darkMode ? "rgba(59, 130, 246, 0.2)" : "#eff6ff") : "transparent",
                        color: sugarLevel === level ? "#3b82f6" : theme.text,
                        fontWeight: sugarLevel === level ? "bold" : "normal",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

<div style={{ marginBottom: "2rem" }}>
  <h4 style={{ fontSize: "1rem", fontWeight: "600", color: theme.text, marginBottom: "1rem" }}>Size</h4>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
    {sizeOptions.map((size) => (
      <button
        key={size}
        onClick={() => setDrinkSize(size)}
        style={{
          padding: "0.75rem",
          borderRadius: "8px",
          border: drinkSize === size ? "2px solid #3b82f6" : `1px solid ${theme.border}`,
          backgroundColor: drinkSize === size ? (darkMode ? "rgba(59, 130, 246, 0.2)" : "#eff6ff") : "transparent",
          color: drinkSize === size ? "#3b82f6" : theme.text,
          fontWeight: drinkSize === size ? "bold" : "normal",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
      >
                        {size}
                        </button>
                        ))}
                    </div>
                </div>

              <div style={{ marginBottom: "2rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", color: theme.text, marginBottom: "1rem" }}>Ice Level</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                  {iceOptions.map((level) => (
                    <button
                      key={level}
                      onClick={() => setIceLevel(level)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: iceLevel === level ? "2px solid #3b82f6" : `1px solid ${theme.border}`,
                        backgroundColor: iceLevel === level ? (darkMode ? "rgba(59, 130, 246, 0.2)" : "#eff6ff") : "transparent",
                        color: iceLevel === level ? "#3b82f6" : theme.text,
                        fontWeight: iceLevel === level ? "bold" : "normal",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", color: theme.text, marginBottom: "1rem" }}>Toppings</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                  {menuItems["Toppings"].map((topping) => {
                    const isSelected = selectedToppings.some(t => t.id === topping.id);
                    return (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping)}
                        style={{
                          padding: "0.75rem",
                          borderRadius: "8px",
                          border: isSelected ? "2px solid #3b82f6" : `1px solid ${theme.border}`,
                          backgroundColor: isSelected ? (darkMode ? "rgba(59, 130, 246, 0.2)" : "#eff6ff") : "transparent",
                          color: theme.text,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          transition: "all 0.2s"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span>{topping.icon}</span>
                          <span>{topping.name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.875rem", color: theme.textMuted }}>+${Number(topping.price).toFixed(2)}</span>
                          {isSelected && <Check size={16} color="#3b82f6" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{
              padding: "1.5rem",
              borderTop: `1px solid ${theme.border}`,
              backgroundColor: darkMode ? "#0f172a" : "#f8fafc"
            }}>
              <button
                onClick={() => addToCart(customizingItem, { size: drinkSize, sugar: sugarLevel, ice: iceLevel, toppings: selectedToppings })}
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.125rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)"
                }}
              >
                Add to Order - ${(Number(customizingItem?.price || 0) + (drinkSize === "Small" ? -0.50 : drinkSize === "Large" ? 0.75 : 0) + selectedToppings.reduce((sum, t) => sum + Number(t.price || 0), 0)).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: theme.card,
            borderRadius: "16px",
            maxWidth: "500px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            border: `1px solid ${theme.border}`,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{
              padding: "1.5rem",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: theme.text, margin: 0 }}>
                Add New Drink
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: theme.textMuted,
                  cursor: "pointer",
                  padding: "0.5rem"
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.product_name}
                  onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                  placeholder="e.g., Classic Milk Tea"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "1rem"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Category *
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "1rem"
                  }}
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="e.g., 5.50"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "1rem"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={newProduct.icon}
                  onChange={(e) => setNewProduct({ ...newProduct, icon: e.target.value })}
                  placeholder="🥤"
                  maxLength="2"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "2rem",
                    textAlign: "center"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="e.g., Rich and creamy milk tea"
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "1rem",
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Ingredients (Inventory Items)
                </label>
                <div style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "8px",
                  padding: "0.75rem",
                  background: theme.bg
                }}>
                  {inventory.length === 0 ? (
                    <div style={{ textAlign: "center", color: theme.textMuted, padding: "1rem" }}>
                      No inventory items available
                    </div>
                  ) : (
                    inventory.map((inv) => {
                      const selected = selectedIngredients.find(ing => ing.inventory_id === inv.inventory_id);
                      return (
                        <div
                          key={inv.inventory_id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.75rem",
                            marginBottom: "0.5rem",
                            border: `1px solid ${selected ? "#3b82f6" : theme.border}`,
                            borderRadius: "8px",
                            background: selected ? (darkMode ? "rgba(59, 130, 246, 0.1)" : "#eff6ff") : "transparent"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={() => toggleIngredient(inv.inventory_id)}
                            style={{
                              width: "18px",
                              height: "18px",
                              cursor: "pointer"
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "0.875rem", fontWeight: "600", color: theme.text }}>
                              {inv.item_name}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>
                              Available: {inv.quantity} {inv.unit}
                            </div>
                          </div>
                          {selected && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={selected.quantity_needed}
                                onChange={(e) => updateIngredientQuantity(inv.inventory_id, e.target.value)}
                                style={{
                                  width: "80px",
                                  padding: "0.5rem",
                                  borderRadius: "4px",
                                  border: `1px solid ${theme.border}`,
                                  background: theme.card,
                                  color: theme.text,
                                  fontSize: "0.875rem"
                                }}
                              />
                              <span style={{ fontSize: "0.75rem", color: theme.textMuted }}>
                                {inv.unit}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "0.5rem" }}>
                  Select ingredients and specify how much is needed per drink
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => {
                    setShowAddProductModal(false);
                    setSelectedIngredients([]);
                  }}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: "transparent",
                    color: theme.text,
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Add Drink
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: theme.card,
            borderRadius: "16px",
            maxWidth: "500px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            border: `1px solid ${theme.border}`,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{
              padding: "1.5rem",
              borderBottom: `1px solid ${theme.border}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: theme.text, margin: 0 }}>
                Edit Drink
              </h3>
              <button
                onClick={() => {
                  setShowEditProductModal(false);
                  setEditingProduct(null);
                  setSelectedIngredients([]);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: theme.textMuted,
                  cursor: "pointer",
                  padding: "0.5rem"
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.product_name}
                  onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                  placeholder="e.g., Classic Milk Tea"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "1rem"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Category *
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "1rem"
                  }}
                >
                  <option value="">Select category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="e.g., 5.50"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "1rem"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  value={newProduct.icon}
                  onChange={(e) => setNewProduct({ ...newProduct, icon: e.target.value })}
                  placeholder="🥤"
                  maxLength="2"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "2rem",
                    textAlign: "center"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="e.g., Rich and creamy milk tea"
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: theme.bg,
                    color: theme.text,
                    fontSize: "1rem",
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", color: theme.text, marginBottom: "0.5rem" }}>
                  Ingredients (Inventory Items)
                </label>
                <div style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: `1px solid ${theme.border}`,
                  borderRadius: "8px",
                  padding: "0.75rem",
                  background: theme.bg
                }}>
                  {inventory.length === 0 ? (
                    <div style={{ textAlign: "center", color: theme.textMuted, padding: "1rem" }}>
                      No inventory items available
                    </div>
                  ) : (
                    inventory.map((inv) => {
                      const selected = selectedIngredients.find(ing => ing.inventory_id === inv.inventory_id);
                      return (
                        <div
                          key={inv.inventory_id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.75rem",
                            marginBottom: "0.5rem",
                            border: `1px solid ${selected ? "#3b82f6" : theme.border}`,
                            borderRadius: "8px",
                            background: selected ? (darkMode ? "rgba(59, 130, 246, 0.1)" : "#eff6ff") : "transparent"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={() => toggleIngredient(inv.inventory_id)}
                            style={{
                              width: "18px",
                              height: "18px",
                              cursor: "pointer"
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "0.875rem", fontWeight: "600", color: theme.text }}>
                              {inv.item_name}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: theme.textMuted }}>
                              Available: {inv.quantity} {inv.unit}
                            </div>
                          </div>
                          {selected && (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={selected.quantity_needed}
                                onChange={(e) => updateIngredientQuantity(inv.inventory_id, e.target.value)}
                                style={{
                                  width: "80px",
                                  padding: "0.5rem",
                                  borderRadius: "4px",
                                  border: `1px solid ${theme.border}`,
                                  background: theme.card,
                                  color: theme.text,
                                  fontSize: "0.875rem"
                                }}
                              />
                              <span style={{ fontSize: "0.75rem", color: theme.textMuted }}>
                                {inv.unit}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                <div style={{ fontSize: "0.75rem", color: theme.textMuted, marginTop: "0.5rem" }}>
                  Select ingredients and specify how much is needed per drink
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={() => {
                    setShowEditProductModal(false);
                    setEditingProduct(null);
                    setSelectedIngredients([]);
                  }}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    background: "transparent",
                    color: theme.text,
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProduct}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Update Drink
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <VoiceControlPanel
        isListening={voiceControl.isListening}
        transcript={voiceControl.transcript}
        isSupported={voiceControl.isSupported}
        error={voiceControl.error}
        onToggle={voiceControl.toggleListening}
        lastCommand={lastCommand}
        commandFeedback={commandFeedback}
      />
    </div>
  );
};

export default CashierView;