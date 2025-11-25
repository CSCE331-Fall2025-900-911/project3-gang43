import React, { useState } from "react";
import { ShoppingCart, Trash2, CreditCard, Sun, Moon, Search, Plus, Minus, Globe, ZoomIn, Eye, Volume2 } from "lucide-react";
import GoogleTranslate from "./GoogleTranslate";

const CashierView = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Milk Tea");
  const [orderNumber] = useState(Math.floor(1000 + Math.random() * 9000));
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState("base");
  const [highContrast, setHighContrast] = useState(false);

  const categories = [
    { name: "Milk Tea", icon: "🧋", color: "#ec4899", key: "Milk Tea" },
    { name: "Fruit Tea", icon: "🍓", color: "#f59e0b", key: "Fruit Tea" },
    { name: "Smoothies", icon: "🥤", color: "#8b5cf6", key: "Smoothies" },
    { name: "Coffee", icon: "☕", color: "#78350f", key: "Coffee" },
    { name: "Toppings", icon: "⭐", color: "#14b8a6", key: "Toppings" },
    { name: "Snacks", icon: "🍪", color: "#ef4444", key: "Snacks" },
  ];

  const menuItems = {
    "Milk Tea": [
      { id: 1, name: "Classic Milk Tea", description: "Traditional Black Tea with Milk", price: 4.5, icon: "☕", color: "#f472b6" },
      { id: 2, name: "Taro Milk Tea", description: "Creamy Taro Flavor", price: 5.25, icon: "🌱", color: "#c084fc" },
      { id: 3, name: "Thai Milk Tea", description: "Spiced with Condensed Milk", price: 4.75, icon: "☕", color: "#fb923c" },
      { id: 4, name: "Matcha Milk Tea", description: "Premium Matcha Blend", price: 5.5, icon: "🍃", color: "#4ade80" },
      { id: 5, name: "Brown Sugar Milk Tea", description: "Rich Brown Sugar Syrup", price: 6.0, icon: "☕", color: "#d97706" },
      { id: 6, name: "Hokkaido Milk Tea", description: "Premium Hokkaido Milk", price: 5.75, icon: "❄️", color: "#60a5fa" },
    ],
    "Fruit Tea": [
      { id: 7, name: "Mango Tea", description: "Fresh Mango Flavor", price: 5.0, icon: "🥭", color: "#fbbf24" },
      { id: 8, name: "Strawberry Tea", description: "Sweet Strawberry Blend", price: 5.0, icon: "🍓", color: "#f87171" },
      { id: 9, name: "Passion Fruit Tea", description: "Tropical Passion Fruit", price: 5.25, icon: "🍊", color: "#fb923c" },
      { id: 10, name: "Lychee Tea", description: "Sweet Lychee Flavor", price: 5.0, icon: "🍑", color: "#fda4af" },
    ],
    Smoothies: [
      { id: 11, name: "Berry Smoothie", description: "Mixed Berry Blend", price: 6.5, icon: "🫐", color: "#a855f7" },
      { id: 12, name: "Mango Smoothie", description: "Tropical Mango", price: 6.0, icon: "🥭", color: "#fbbf24" },
      { id: 13, name: "Avocado Smoothie", description: "Creamy Avocado", price: 6.25, icon: "🥑", color: "#22c55e" },
    ],
    Coffee: [
      { id: 14, name: "Espresso", description: "Strong Espresso Shot", price: 3.5, icon: "☕", color: "#92400e" },
      { id: 15, name: "Latte", description: "Smooth Milk Coffee", price: 4.5, icon: "☕", color: "#d97706" },
      { id: 16, name: "Cappuccino", description: "Foamy Cappuccino", price: 4.75, icon: "☕", color: "#b45309" },
    ],
    Toppings: [
      { id: 17, name: "Boba Pearls", description: "Classic Tapioca Pearls", price: 0.75, icon: "⚫", color: "#374151" },
      { id: 18, name: "Pudding", description: "Creamy Egg Pudding", price: 1.0, icon: "🍮", color: "#fde047" },
      { id: 19, name: "Aloe Vera", description: "Fresh Aloe Vera", price: 0.75, icon: "🌿", color: "#22c55e" },
      { id: 20, name: "Jelly", description: "Fruit Jelly", price: 0.75, icon: "🟣", color: "#a855f7" },
    ],
    Snacks: [
      { id: 21, name: "Popcorn Chicken", description: "Crispy Chicken Bites", price: 5.5, icon: "🍗", color: "#f97316" },
      { id: 22, name: "Spring Rolls", description: "Crispy Spring Rolls", price: 4.5, icon: "🥟", color: "#fbbf24" },
      { id: 23, name: "Fries", description: "Golden French Fries", price: 3.5, icon: "🍟", color: "#eab308" },
    ],
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
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

  const clearCart = () => setCart([]);

  const getSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getTax = () => getSubtotal() * 0.085;
  const getTotal = () => getSubtotal() + getTax();

  const currentItems = menuItems[selectedCategory] || [];
  const filteredItems = currentItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFontSizeMultiplier = () => {
    if (fontSize === "large") return 1.2;
    if (fontSize === "xlarge") return 1.4;
    return 1;
  };

  const fontMultiplier = getFontSizeMultiplier();

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
                  <div style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>Demo Cashier</div>
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
                DC
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
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
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
                    backgroundColor: selectedCategory === category.key ? category.color : "transparent",
                    color: selectedCategory === category.key ? "white" : theme.text,
                    transform: selectedCategory === category.key ? "translateX(4px)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.key) {
                      e.currentTarget.style.backgroundColor = theme.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.key) {
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
                {categories.find(c => c.key === selectedCategory)?.name || "All Items"}
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
              {filteredItems.map((item) => (
                <button
                  key={item.id}
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
                    {item.icon}
                  </div>
                  <h3 style={{
                    fontSize: `${0.9375 * fontMultiplier}rem`,
                    fontWeight: "600",
                    color: theme.text,
                    marginBottom: "0.25rem",
                    lineHeight: "1.3"
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    fontSize: `${0.75 * fontMultiplier}rem`,
                    color: theme.textMuted,
                    marginBottom: "0.75rem",
                    lineHeight: "1.4"
                  }}>
                    {item.description}
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
                          <div style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>{item.name}</div>
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
                  Process Payment
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
