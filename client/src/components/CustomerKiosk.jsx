import React, { useState, useEffect } from "react";
import { Globe, ZoomIn, Eye, Trash2, X, Youtube, ShoppingCart, CreditCard, Search, Plus, Minus, Sun, Moon, Volume2} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import GoogleTranslate from "./GoogleTranslate";

const CustomerKiosk = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState("base");
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

const handleYouTubeReviews = async () => {
    if (cart.length === 0) {
      alert("Empty cart: Add drinks to use the YouTube feature.");
      return;
    }

    const drinkNames = [...new Set(cart.map((item) => item.product_name))];

    try {
      alert(`Ready to search for reviews of: ${drinkNames.join(", ")}`);

      // --- This is the new SDK method ---

      // 2. Get API key from Vite's import.meta.env
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        alert("API Key not found. Please check your .env file and restart your server.");
        return;
      }

      // Check if the SDK is available
      if (!GoogleGenerativeAI) {
        alert("Google AI SDK not found. Please run 'npm install @google/generative-ai'");
        return;
      }

      // 3. Initialize the SDK
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // 4. Get the model. We must use a model that supports tools.
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", // Use the correct model name
        tools: [
          {
            google_search: {}, // Use 'google_search', not 'google_search_retrieval' for the SDK
          },
        ],
      });

      // 5. Create the prompt with your text
      const prompt = `I need exactly ONE working link to a blog or article that contains human reviews of all of these bubble tea drinks: ${drinkNames.join(", ")}.
        Please search the web and find one good blog review website for each drink. The blog/review should contain a review of every drink in the list. Return your response as a JSON array with this exact format:
        [
            {"drink": "drink name", "url": "blog url", "title": "site title"},
            ...
        ]

        Only return the JSON array, nothing else. Make sure the URL is complete and a valid blog link. Again, DO NOT RETURN more than one link.`;

      // 6. Call the API
      const result = await model.generateContent(prompt);
      const response = result.response;
      const textContent = response.text();
      
      console.log("API Response Text:", textContent);

      // 7. Parse the JSON from the response text
      const jsonMatch = textContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const videos = JSON.parse(jsonMatch[0]);
        console.log("Parsed videos:", videos);

        if (videos.length > 0) {
          videos.forEach((video, index) => {
            setTimeout(() => {
              window.open(video.url, "_blank");
            }, index * 500); // Stagger the opening
          });
          alert(`Opening ${videos.length} YouTube review(s) in new tabs!`);
        } else {
          alert("No videos found for your drinks.");
        }
      } else {
        alert("Could not parse video results from the API response.");
      }
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
      alert(`Failed to fetch video recommendations: ${error.message}`);
    }
  };

  const filteredItems =
    selectedCategory === "all"
      ? menuItems.filter((item) => item.is_available)
      : menuItems.filter(
          (item) => item.category === selectedCategory && item.is_available
        );

  const getFontSizeMultiplier = () => {
    if (fontSize === "large") return 1.2;
    if (fontSize === "xlarge") return 1.4;
    return 1;
  };

  const fontMultiplier = getFontSizeMultiplier();

  // Theme colors - using high contrast if enabled, otherwise dark/light mode
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
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-4xl font-bold ${textClass}`}>Bubble Tea Shop</h1>
          <div className="flex gap-2">
            <button
              onClick={handleYouTubeReviews}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 ${fontSizeClass} ${
                highContrast
                  ? "bg-purple-600 text-yellow-300 hover:bg-purple-700 border-2 border-yellow-400"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              } shadow-md hover:shadow-lg transition-all font-semibold`}
              aria-label="Voice order"
            >
              <Youtube className="w-5 h-5" />
                YouTube Reviews
            </button>
            <button
              className={`p-3 rounded ${cardBgClass} flex items-center gap-2 ${fontSizeClass}`}
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
              aria-label="Change language"
            >
              <Globe className="w-5 h-5" />
              {language === "en" ? "English" : "Español"}
            </button>
            <button
              className={`p-3 rounded ${cardBgClass}`}
              onClick={() =>
                setFontSize(
                  fontSize === "base"
                    ? "large"
                    : fontSize === "large"
                    ? "xlarge"
                    : "base"
                )
              }
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
                {t(categories.find((c) => c.id === selectedCategory)?.nameKey || "allItems")}
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

        {/* Right Sidebar - Current Order */}
        <div>
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
                Order #{Math.floor(1000 + Math.random() * 9000)}
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
                    <span style={{ fontSize: `${1.25 * fontMultiplier}rem`, fontWeight: "bold", color: highContrast ? theme.accent : "#3b82f6" }}>${getGrandTotal()}</span>
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
    </div>
  );
};

export default CustomerKiosk;
