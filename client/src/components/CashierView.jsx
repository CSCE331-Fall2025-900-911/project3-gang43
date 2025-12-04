import React, { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Trash2, CreditCard, Sun, Moon, Search, Plus, Minus, Globe, ZoomIn, Eye, Volume2, AlertCircle } from "lucide-react";
import GoogleTranslate from "./GoogleTranslate";
import { getAllProducts, getCategories, checkoutOrder } from '../services/routes.js';

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
  
  const { user } = useAuth();
  const displayName = user?.name || 'Demo Cashier';
  const initials = displayName
  .trim()
  .split(' ')
  .filter(word => word.length > 0)
  .map(word => word[0])
  .join('')
  .toUpperCase();

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('[CashierView] Starting data fetch...');
        setLoading(true);
        setError(null);
        
        console.log('[CashierView] API_URL being used:', 
          typeof getAllProducts === 'function' ? 'Function imported successfully' : 'IMPORT ERROR');
        
        // Fetch categories and products in parallel
        console.log('[CashierView] Fetching categories...');
        const categoriesResponse = await getCategories();
        console.log('[CashierView] Categories response:', categoriesResponse);

        console.log('[CashierView] Fetching products...');
        const productsResponse = await getAllProducts();
        console.log('[CashierView] Products response:', productsResponse);

        if (categoriesResponse.success) {
          console.log('[CashierView] Setting categories:', categoriesResponse.data);
          setCategories(categoriesResponse.data);
          // Set first category as default
          if (categoriesResponse.data.length > 0) {
            console.log('[CashierView] Setting default category:', categoriesResponse.data[0]);
            setSelectedCategory(categoriesResponse.data[0]);
          }
        } else {
          console.warn('[CashierView] Categories response unsuccessful:', categoriesResponse);
        }

        if (productsResponse.success) {
          console.log('[CashierView] Setting products:', productsResponse.data.length, 'items');
          setProducts(productsResponse.data);
        } else {
          console.warn('[CashierView] Products response unsuccessful:', productsResponse);
        }
        
        console.log('[CashierView] Data fetch completed successfully');
      } catch (err) {
        console.error('[CashierView] Error during data fetch:', err);
        console.error('[CashierView] Error details:', {
          message: err.message,
          stack: err.stack,
          toString: err.toString(),
        });
        setError('Failed to load products. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.product_id === item.product_id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.product_id === item.product_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      // ensure cart item has a friendly `name` property for legacy UI usage
      setCart([...cart, { ...item, name: item.product_name || item.name, price: Number(item.price), cartId: Date.now(), quantity: 1 }]);
    }
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
  const getTax = () => getSubtotal() * 0.085;
  const getTotal = () => getSubtotal() + getTax();

  // Filter products by selected category
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
    console.log('[Checkout] Starting checkout process...');
    console.log('[Checkout] Cart items:', cart);
    
    if (cart.length === 0) {
      console.warn('[Checkout] Cart is empty');
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
      }));

      console.log('[Checkout] Preparing checkout with:');
      console.log('[Checkout] - Items:', cartItems);
      console.log('[Checkout] - Subtotal:', getSubtotal());
      console.log('[Checkout] - Tax:', getTax());
      console.log('[Checkout] - Total:', getTotal());
      console.log('[Checkout] - Cashier:', displayName);

      const response = await checkoutOrder(
        cartItems,
        getTotal(),
        getSubtotal(),
        getTax(),
        displayName
      );

      console.log('[Checkout] Response received:', response);

      if (response.success) {
        console.log('[Checkout] Order successful! Order ID:', response.data.orderId);
        setInventoryWarnings(response.data.warnings || []);
        setCheckoutMessage({
          type: 'success',
          text: `Order #${response.data.orderId} processed successfully!`,
        });
        setCart([]);
        // Clear message after 3 seconds
        setTimeout(() => setCheckoutMessage(null), 3000);
      } else {
        console.error('[Checkout] Order failed:', response.message);
        setCheckoutMessage({
          type: 'error',
          text: response.message || 'Failed to process order',
        });
      }
    } catch (error) {
      console.error('[Checkout] Exception during checkout:', error);
      console.error('[Checkout] Error details:', {
        message: error.message,
        stack: error.stack,
      });
      setCheckoutMessage({
        type: 'error',
        text: 'Error processing order. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Theme colors
  const theme = highContrast ? {
    bg: "#000000",
    card: "#1a1a1a",
    text: "#6d499c",
    textMuted: "#8f79e8",
    border: "#6d499c",
    hover: "#333333",
    accent: "#6d499c",
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
    <div style={{ backgroundColor: theme.bg, minHeight: "100vh" }}>
      {/* Header */}
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
                <h1 style={{ fontSize: `${1.25 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text, margin: 0 }}>BubblePOS</h1>
                <p style={{ fontSize: `${0.875 * fontMultiplier}rem`, color: theme.textMuted, margin: 0 }}>Downtown Store - Terminal #1</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              {/* Voice Order Button */}
              <button
                style={{
                  padding: `${0.625 * fontMultiplier}rem ${1 * fontMultiplier}rem`,
                  borderRadius: "10px",
                  border: "none",
                  background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "600",
                  fontSize: `${0.875 * fontMultiplier}rem`,
                  boxShadow: "0 2px 4px rgba(236, 72, 153, 0.3)"
                }}
              >
                <Volume2 style={{ width: `${18 * fontMultiplier}px`, height: `${18 * fontMultiplier}px` }} />
                Voice Order
              </button>

              {/* Google Translate */}
              <div style={{
                padding: "0.25rem",
                borderRadius: "10px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.card
              }}>
                <GoogleTranslate />
              </div>

              {/* Font Size Toggle */}
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

              {/* Dark Mode Toggle */}
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

              {/* High Contrast Toggle */}
              <button
                onClick={() => {
                  setHighContrast(!highContrast);
                  if (!highContrast) setDarkMode(false);
                }}
                style={{
                  padding: `${0.625 * fontMultiplier}rem ${1 * fontMultiplier}rem`,
                  borderRadius: "10px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: highContrast ? "#6d499c" : theme.card,
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
                  <div style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>{displayName}</div>
                  <div style={{ fontSize: `${0.75 * fontMultiplier}rem`, color: theme.textMuted }}>Cashier</div>
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

      {/* Main Content */}
      <div style={{ padding: `${1.5 * fontMultiplier}rem`, display: "grid", gridTemplateColumns: "250px 1fr 350px", gap: `${1.5 * fontMultiplier}rem` }}>
        {/* Left Sidebar - Categories */}
        <div>
          <div style={{ backgroundColor: theme.card, borderRadius: "16px", border: `1px solid ${theme.border}`, overflow: "hidden" }}>
            <div style={{ padding: `${1.25 * fontMultiplier}rem`, borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Categories
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

        {/* Center - Menu Items */}
        <div>
          <div style={{ backgroundColor: theme.card, borderRadius: "16px", border: `1px solid ${theme.border}`, padding: `${1.5 * fontMultiplier}rem` }}>
            <div style={{ marginBottom: `${1.5 * fontMultiplier}rem` }}>
              <h2 style={{ fontSize: `${1.75 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text, marginBottom: "1rem" }}>
                {selectedCategory || "All Items"}
              </h2>

              {/* Search Bar */}
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
                  <button
                    key={item.product_id}
                    onClick={() => addToCart(item)}
                    style={{
                      backgroundColor: highContrast ? "#1a1a1a" : (darkMode ? "#1e293b" : "white"),
                      border: `2px solid ${theme.border}`,
                      borderRadius: "16px",
                      padding: `${1.25 * fontMultiplier}rem`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(59, 130, 246, 0.4)`;
                      e.currentTarget.style.borderColor = "#3b82f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = theme.border;
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
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Current Order */}
        <div>
          <div style={{ backgroundColor: theme.card, borderRadius: "16px", border: `1px solid ${theme.border}`, padding: `${1.25 * fontMultiplier}rem`, position: "sticky", top: `${1.5 * fontMultiplier}rem` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: `${1.125 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text, margin: 0 }}>Current Order</h2>
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
                  <p style={{ color: theme.textMuted, fontSize: `${0.875 * fontMultiplier}rem`, margin: 0 }}>Your cart is empty!</p>
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

                {/* Checkout Message */}
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

                {/* Inventory Warnings */}
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.75rem" }}>
                  <button style={{
                    padding: `${0.625 * fontMultiplier}rem`,
                    borderRadius: "8px",
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.card,
                    color: theme.text,
                    fontSize: `${0.875 * fontMultiplier}rem`,
                    fontWeight: "500",
                    cursor: "pointer"
                  }}>
                    Hold
                  </button>
                  <button style={{
                    padding: `${0.625 * fontMultiplier}rem`,
                    borderRadius: "8px",
                    border: "1px solid #fecaca",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    fontSize: `${0.875 * fontMultiplier}rem`,
                    fontWeight: "500",
                    cursor: "pointer"
                  }}>
                    Void
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierView;
