import React, { useState } from "react";
import { ShoppingCart, Trash2, CreditCard, Sun, Moon, Search, ZoomIn, Eye, Volume2, X, Check } from "lucide-react";

const CashierView = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Milk Tea");
  const [orderNumber] = useState(Math.floor(1000 + Math.random() * 9000));
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState("base");
  const [highContrast, setHighContrast] = useState(false);

  // Customization State
  const [customizingItem, setCustomizingItem] = useState(null);
  const [sugarLevel, setSugarLevel] = useState("100%");
  const [iceLevel, setIceLevel] = useState("Regular");
  const [selectedToppings, setSelectedToppings] = useState([]);

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
      { id: 1, name: "Classic Milk Tea", description: "Traditional black tea with milk", price: 4.5, icon: "☕", color: "#f472b6" },
      { id: 2, name: "Taro Milk Tea", description: "Creamy taro flavor", price: 5.25, icon: "🌱", color: "#c084fc" },
      { id: 3, name: "Thai Milk Tea", description: "Spiced with condensed milk", price: 4.75, icon: "☕", color: "#fb923c" },
      { id: 4, name: "Matcha Milk Tea", description: "Premium matcha blend", price: 5.5, icon: "🍃", color: "#4ade80" },
      { id: 5, name: "Brown Sugar Milk Tea", description: "Rich brown sugar syrup", price: 6.0, icon: "☕", color: "#d97706" },
      { id: 6, name: "Hokkaido Milk Tea", description: "Premium Hokkaido milk", price: 5.75, icon: "❄️", color: "#60a5fa" },
    ],
    "Fruit Tea": [
      { id: 7, name: "Mango Tea", description: "Fresh mango flavor", price: 5.0, icon: "🥭", color: "#fbbf24" },
      { id: 8, name: "Strawberry Tea", description: "Sweet strawberry blend", price: 5.0, icon: "🍓", color: "#f87171" },
      { id: 9, name: "Passion Fruit Tea", description: "Tropical passion fruit", price: 5.25, icon: "🍊", color: "#fb923c" },
      { id: 10, name: "Lychee Tea", description: "Sweet lychee flavor", price: 5.0, icon: "🍑", color: "#fda4af" },
    ],
    Smoothies: [
      { id: 11, name: "Berry Smoothie", description: "Mixed berry blend", price: 6.5, icon: "🫐", color: "#a855f7" },
      { id: 12, name: "Mango Smoothie", description: "Tropical mango", price: 6.0, icon: "🥭", color: "#fbbf24" },
      { id: 13, name: "Avocado Smoothie", description: "Creamy avocado", price: 6.25, icon: "🥑", color: "#22c55e" },
    ],
    Coffee: [
      { id: 14, name: "Espresso", description: "Strong espresso shot", price: 3.5, icon: "☕", color: "#92400e" },
      { id: 15, name: "Latte", description: "Smooth milk coffee", price: 4.5, icon: "☕", color: "#d97706" },
      { id: 16, name: "Cappuccino", description: "Foamy cappuccino", price: 4.75, icon: "☕", color: "#b45309" },
    ],
    Toppings: [
      { id: 17, name: "Boba Pearls", description: "Classic tapioca pearls", price: 0.75, icon: "⚫", color: "#374151" },
      { id: 18, name: "Pudding", description: "Creamy egg pudding", price: 1.0, icon: "🍮", color: "#fde047" },
      { id: 19, name: "Aloe Vera", description: "Fresh aloe vera", price: 0.75, icon: "🌿", color: "#22c55e" },
      { id: 20, name: "Jelly", description: "Fruit jelly", price: 0.75, icon: "🟣", color: "#a855f7" },
    ],
    Snacks: [
      { id: 21, name: "Popcorn Chicken", description: "Crispy chicken bites", price: 5.5, icon: "🍗", color: "#f97316" },
      { id: 22, name: "Spring Rolls", description: "Crispy spring rolls", price: 4.5, icon: "🥟", color: "#fbbf24" },
      { id: 23, name: "Fries", description: "Golden french fries", price: 3.5, icon: "🍟", color: "#eab308" },
    ],
  };

  const sugarOptions = ["0%", "30%", "50%", "70%", "100%", "120%"];
  const iceOptions = ["No Ice", "Less Ice", "Regular", "Extra Ice", "Hot"];

  // Helper to determine if an item is a drink based on which category list it belongs to
  const isDrinkItem = (item) => {
    const drinkCategories = ["Milk Tea", "Fruit Tea", "Smoothies", "Coffee"];
    return Object.keys(menuItems).some(cat => 
      drinkCategories.includes(cat) && menuItems[cat].some(i => i.id === item.id)
    );
  };

  const handleItemClick = (item) => {
    if (isDrinkItem(item)) {
      setCustomizingItem(item);
      setSugarLevel("100%");
      setIceLevel("Regular");
      setSelectedToppings([]);
    } else {
      addToCart(item);
    }
  };

  const toggleTopping = (topping) => {
    if (selectedToppings.find(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const addToCart = (item, customizations = null) => {
    // Calculate price including toppings
    let finalPrice = item.price;
    if (customizations && customizations.toppings) {
      finalPrice += customizations.toppings.reduce((sum, t) => sum + t.price, 0);
    }

    const itemToAdd = {
      ...item,
      price: finalPrice,
      customizations: customizations
    };

    // Check for existing item with IDENTICAL customizations
    const existingItemIndex = cart.findIndex(cartItem => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
    );

    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...itemToAdd, cartId: Date.now(), quantity: 1 }]);
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
                <h1 style={{ fontSize: `${1.25 * fontMultiplier}rem`, fontWeight: "bold", color: theme.text, margin: 0 }}>Bubble POS</h1>
                <p style={{ fontSize: `${0.875 * fontMultiplier}rem`, color: theme.textMuted, margin: 0 }}>Downtown Store</p>
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
                  <div style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>Mike Chen</div>
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
                  MC
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
                CATEGORIES
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
                  onClick={() => handleItemClick(item)}
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
                          <div style={{ fontSize: `${0.875 * fontMultiplier}rem`, fontWeight: "600", color: theme.text }}>{item.name}</div>
                          {item.customizations && (
                            <div style={{ fontSize: `${0.75 * fontMultiplier}rem`, color: theme.textMuted, marginTop: "0.25rem" }}>
                              <div>Sugar: {item.customizations.sugar} • Ice: {item.customizations.ice}</div>
                              {item.customizations.toppings.length > 0 && (
                                <div>+ {item.customizations.toppings.map(t => t.name).join(", ")}</div>
                              )}
                            </div>
                          )}
                          <div style={{ fontSize: `${0.8125 * fontMultiplier}rem`, color: theme.textMuted, marginTop: "0.25rem" }}>${item.price.toFixed(2)}</div>
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

      {/* Customization Modal */}
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
          zIndex: 50
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
                <div style={{ fontSize: "2.5rem" }}>{customizingItem.icon}</div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: theme.text, margin: 0 }}>
                    {customizingItem.name}
                  </h3>
                  <p style={{ color: theme.textMuted, margin: 0 }}>${customizingItem.price.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
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

            <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
              {/* Sugar Level */}
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

              {/* Ice Level */}
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

              {/* Toppings */}
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
                          <span style={{ fontSize: "0.875rem", color: theme.textMuted }}>+${topping.price.toFixed(2)}</span>
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
                onClick={() => addToCart(customizingItem, { sugar: sugarLevel, ice: iceLevel, toppings: selectedToppings })}
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
                Add to Order - ${(customizingItem.price + selectedToppings.reduce((sum, t) => sum + t.price, 0)).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierView;