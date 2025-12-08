import React, { useState, useEffect, useCallback } from "react";
import { Globe, ZoomIn, Eye, Trash2, X, Mic, ShoppingCart, CreditCard, Search, Plus, Minus, Sun, Moon, Volume2 } from "lucide-react";
import GoogleTranslate from "./GoogleTranslate";
import useVoiceControl from "../hooks/useVoiceControl";
import VoiceControlPanel from "./VoiceControlPanel";
import { useWeatherDiscount } from "../hooks/useWeatherDiscount";
import WeatherWidget from "./WeatherWidget";

const CustomerKiosk = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState("base");
  const [cart, setCart] = useState([]);
  const [orderNumber] = useState(Math.floor(1000 + Math.random() * 9000));
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [commandFeedback, setCommandFeedback] = useState(null);

  // Weather discount hook
  const {
    discountPercent,
    discountMessage,
    loading: weatherLoading,
    error: weatherError,
    fetchWeatherByLocation
  } = useWeatherDiscount('College Station');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const placeholderData = [
          { product_id: 1, product_name: "Classic Milk Tea", size: "Traditional black tea with milk", price: 4.5, is_available: true, category: "milk-tea", image: "☕", color: "#f472b6" },
          { product_id: 2, product_name: "Taro Milk Tea", size: "Creamy taro flavor", price: 5.25, is_available: true, category: "milk-tea", image: "🌱", color: "#c084fc" },
          { product_id: 3, product_name: "Thai Milk Tea", size: "Spiced with condensed milk", price: 4.75, is_available: true, category: "milk-tea", image: "☕", color: "#fb923c" },
          { product_id: 4, product_name: "Matcha Milk Tea", size: "Premium matcha blend", price: 5.5, is_available: true, category: "milk-tea", image: "🍃", color: "#4ade80" },
          { product_id: 5, product_name: "Brown Sugar Milk Tea", size: "Rich brown sugar syrup", price: 6.0, is_available: true, category: "milk-tea", image: "☕", color: "#d97706" },
          { product_id: 6, product_name: "Hokkaido Milk Tea", size: "Premium Hokkaido milk", price: 5.75, is_available: true, category: "milk-tea", image: "❄️", color: "#60a5fa" },
          { product_id: 7, product_name: "Mango Tea", size: "Fresh mango flavor", price: 5.0, is_available: true, category: "fruit-tea", image: "🥭", color: "#fbbf24" },
          { product_id: 8, product_name: "Strawberry Tea", size: "Sweet strawberry blend", price: 5.0, is_available: true, category: "fruit-tea", image: "🍓", color: "#f87171" },
          { product_id: 9, product_name: "Lychee Tea", size: "Sweet lychee flavor", price: 5.0, is_available: true, category: "fruit-tea", image: "🍑", color: "#fda4af" },
          { product_id: 10, product_name: "Passion Fruit Tea", size: "Tropical passion fruit", price: 5.25, is_available: true, category: "fruit-tea", image: "🍊", color: "#fb923c" },
        ];

        setMenuItems(placeholderData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: "all", name: "All Items", icon: "🌟", color: "#3b82f6" },
    { id: "milk-tea", name: "Milk Tea", icon: "🧋", color: "#ec4899" },
    { id: "fruit-tea", name: "Fruit Tea", icon: "🍹", color: "#f59e0b" },
    { id: "specialty", name: "Specialty", icon: "🍵", color: "#8b5cf6" },
  ];

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.product_id === item.product_id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.product_id === item.product_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, cartId: Date.now(), quantity: 1 }]);
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

  const getTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  const getDiscountAmount = () => {
    const subtotal = parseFloat(getTotal());
    return (subtotal * discountPercent / 100).toFixed(2);
  };
  const getDiscountedTotal = () => {
    const subtotal = parseFloat(getTotal());
    const discount = parseFloat(getDiscountAmount());
    return (subtotal - discount).toFixed(2);
  };
  const getTax = () => (parseFloat(getDiscountedTotal()) * 0.085).toFixed(2);
  const getGrandTotal = () => (parseFloat(getDiscountedTotal()) + parseFloat(getTax())).toFixed(2);

  const filteredItems = selectedCategory === "all"
    ? menuItems.filter((item) => item.is_available && item.product_name.toLowerCase().includes(searchQuery.toLowerCase()))
    : menuItems.filter((item) => item.category === selectedCategory && item.is_available && item.product_name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getFontSizeMultiplier = () => {
    if (fontSize === "large") return 1.2;
    if (fontSize === "xlarge") return 1.4;
    return 1;
  };

  const fontMultiplier = getFontSizeMultiplier();

  // Voice command handler
  const handleVoiceCommand = useCallback((command) => {
    const lowerCommand = command.toLowerCase().trim();

    // Add to cart commands
    const addPatterns = [
      /add (.*)/,
      /i want (.*)/,
      /order (.*)/,
      /get me (.*)/,
      /can i have (.*)/
    ];

    // Remove from cart commands
    const removePatterns = [
      /remove (.*)/,
      /delete (.*)/,
      /take out (.*)/
    ];

    // Navigation commands
    if (lowerCommand.includes('show all') || lowerCommand.includes('all items')) {
      setSelectedCategory('all');
      setCommandFeedback({ success: true, message: 'Showing all items' });
      return;
    }

    if (lowerCommand.includes('milk tea') && !lowerCommand.includes('add') && !lowerCommand.includes('order')) {
      setSelectedCategory('milk-tea');
      setCommandFeedback({ success: true, message: 'Showing milk tea' });
      return;
    }

    if (lowerCommand.includes('fruit tea') && !lowerCommand.includes('add') && !lowerCommand.includes('order')) {
      setSelectedCategory('fruit-tea');
      setCommandFeedback({ success: true, message: 'Showing fruit tea' });
      return;
    }

    if (lowerCommand.includes('clear cart')) {
      setCart([]);
      setCommandFeedback({ success: true, message: 'Cart cleared' });
      return;
    }

    if (lowerCommand.includes('checkout') || lowerCommand.includes('place order')) {
      if (cart.length > 0) {
        setCommandFeedback({ success: true, message: 'Ready to checkout!' });
      } else {
        setCommandFeedback({ success: false, message: 'Your cart is empty' });
      }
      return;
    }

    // Try to match add patterns
    for (const pattern of addPatterns) {
      const match = lowerCommand.match(pattern);
      if (match) {
        const itemName = match[1];
        const item = menuItems.find(m =>
          m.product_name.toLowerCase().includes(itemName) ||
          itemName.includes(m.product_name.toLowerCase())
        );

        if (item) {
          addToCart(item);
          setCommandFeedback({
            success: true,
            message: `Added ${item.product_name} to cart`
          });
          return;
        } else {
          setCommandFeedback({
            success: false,
            message: `Could not find "${itemName}"`
          });
          return;
        }
      }
    }

    // Try to match remove patterns
    for (const pattern of removePatterns) {
      const match = lowerCommand.match(pattern);
      if (match) {
        const itemName = match[1];
        const cartItem = cart.find(c =>
          c.product_name.toLowerCase().includes(itemName) ||
          itemName.includes(c.product_name.toLowerCase())
        );

        if (cartItem) {
          removeFromCart(cartItem.cartId);
          setCommandFeedback({
            success: true,
            message: `Removed ${cartItem.product_name} from cart`
          });
          return;
        } else {
          setCommandFeedback({
            success: false,
            message: `"${itemName}" not found in cart`
          });
          return;
        }
      }
    }

    // If no pattern matched
    setCommandFeedback({
      success: false,
      message: 'Command not recognized. Try "Add [drink name]"'
    });
  }, [menuItems, cart, addToCart, removeFromCart]);

  // Voice control hook
  const {
    isListening,
    transcript,
    isSupported,
    error,
    toggleListening
  } = useVoiceControl({
    onCommand: handleVoiceCommand,
    enabled: true
  });

  // Theme colors - using high contrast if enabled, otherwise dark/light mode
  const theme = highContrast ? {
    bg: "#000000",
    card: "#1a1a1a",
    text: "#6d499c",
    textMuted: "#fdd835",
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
                <p style={{ fontSize: `${0.875 * fontMultiplier}rem`, color: theme.textMuted, margin: 0 }}>Customer Kiosk</p>
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
                {fontSize === "base" ? "A" : fontSize === "large" ? "A+" : "A++"}
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
            </div>
          </div>
        </div>
      </div>

      {/* Weather Discount Banner */}
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
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
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
                    backgroundColor: selectedCategory === category.id ? category.color : "transparent",
                    color: selectedCategory === category.id ? "white" : theme.text,
                    transform: selectedCategory === category.id ? "translateX(4px)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.backgroundColor = theme.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span style={{ fontSize: `${1.5 * fontMultiplier}rem` }}>{category.icon}</span>
                  <span>{category.name}</span>
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
                {categories.find((c) => c.id === selectedCategory)?.name || "All Items"}
              </h2>

              {/* Search Bar */}
              <div style={{ position: "relative" }}>
                <Search style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.textMuted,
                  width: `${20 * fontMultiplier}px`,
                  height: `${20 * fontMultiplier}px`
                }} />
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

            {loading ? (
              <div style={{ textAlign: "center", fontSize: `${1.25 * fontMultiplier}rem`, color: theme.text }}>
                Loading menu...
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
                {filteredItems.map((item) => (
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
                      e.currentTarget.style.boxShadow = `0 10px 25px -5px ${item.color}40`;
                      e.currentTarget.style.borderColor = item.color;
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
                      {item.image}
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
                      {item.size}
                    </p>
                    <div style={{
                      fontSize: `${1.25 * fontMultiplier}rem`,
                      fontWeight: "bold",
                      color: item.color
                    }}>
                      ${item.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Weather & Current Order */}
        <div>
          {/* Weather Widget */}
          <div style={{ marginBottom: `${1.5 * fontMultiplier}rem` }}>
            <WeatherWidget />
          </div>

          {/* Current Order */}
          <div style={{ backgroundColor: theme.card, borderRadius: "16px", border: `1px solid ${theme.border}`, padding: `${1.25 * fontMultiplier}rem`, position: "sticky", top: `${1.5 * fontMultiplier}rem` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: `${1.125 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text, margin: 0 }}>Current Order</h2>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
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
                          <div style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>{item.product_name}</div>
                          <div style={{ fontSize: `${0.8125 * fontMultiplier}rem`, color: theme.textMuted }}>${item.price.toFixed(2)}</div>
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
                          fontSize: `${0.875 * fontMultiplier}rem`,
                          fontWeight: "600",
                          color: theme.text
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
                          fontSize: `${0.875 * fontMultiplier}rem`,
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
                    <span style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>${getTotal()}</span>
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
                        -${getDiscountAmount()}
                      </span>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: `${0.875 * fontMultiplier}rem`, color: theme.textMuted }}>Tax (8.5%)</span>
                    <span style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>${getTax()}</span>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "0.75rem",
                    borderTop: `1px solid ${theme.border}`
                  }}>
                    <span style={{ fontSize: `${1 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text }}>Total</span>
                    <span style={{
                      fontSize: `${1.25 * fontMultiplier}rem`,
                      fontWeight: "bold",
                      color: highContrast ? theme.accent : "#3b82f6"
                    }}>
                      ${getGrandTotal()}
                    </span>
                  </div>
                </div>

                <button
                  style={{
                    width: "100%",
                    padding: `${0.875 * fontMultiplier}rem`,
                    borderRadius: "10px",
                    border: "none",
                    background: highContrast ? theme.accent : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    color: highContrast ? "#000" : "white",
                    fontWeight: "bold",
                    fontSize: `${1 * fontMultiplier}rem`,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.2s",
                    boxShadow: highContrast ? "none" : "0 4px 6px -1px rgba(59, 130, 246, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (!highContrast) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(59, 130, 246, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!highContrast) {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(59, 130, 246, 0.3)";
                    }
                  }}
                >
                  <CreditCard style={{ width: `${20 * fontMultiplier}px`, height: `${20 * fontMultiplier}px` }} />
                  Checkout
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

      {/* Voice Control Panel */}
      <VoiceControlPanel
        isListening={isListening}
        transcript={transcript}
        isSupported={isSupported}
        error={error}
        onToggle={toggleListening}
        commandFeedback={commandFeedback}
      />
    </div>
  );
};

export default CustomerKiosk;
