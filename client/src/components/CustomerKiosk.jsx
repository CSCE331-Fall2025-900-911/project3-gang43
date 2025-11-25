import React, { useState, useEffect } from "react";
import { Globe, ZoomIn, Eye, Trash2, X, Youtube } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CustomerKiosk = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState("base");
  const [language, setLanguage] = useState("en");
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/products');
        // const data = await response.json();
        // setMenuItems(data);

        // Placeholder data for now
        const placeholderData = [
          {
            product_id: 1,
            product_name: "Classic Milk Tea",
            size: "Medium",
            price: 5.5,
            is_available: true,
            category: "milk-tea",
            image: "🧋",
          },
          {
            product_id: 2,
            product_name: "Taro Milk Tea",
            size: "Medium",
            price: 6.0,
            is_available: true,
            category: "milk-tea",
            image: "🧋",
          },
          {
            product_id: 3,
            product_name: "Matcha Latte",
            size: "Medium",
            price: 6.5,
            is_available: true,
            category: "specialty",
            image: "🍵",
          },
          {
            product_id: 4,
            product_name: "Fruit Tea",
            size: "Medium",
            price: 5.0,
            is_available: true,
            category: "fruit-tea",
            image: "🍹",
          },
          {
            product_id: 5,
            product_name: "Brown Sugar Boba",
            size: "Medium",
            price: 6.5,
            is_available: true,
            category: "specialty",
            image: "🧋",
          },
          {
            product_id: 6,
            product_name: "Thai Tea",
            size: "Medium",
            price: 5.5,
            is_available: true,
            category: "milk-tea",
            image: "🧋",
          },
          {
            product_id: 7,
            product_name: "Mango Tea",
            size: "Medium",
            price: 5.5,
            is_available: true,
            category: "fruit-tea",
            image: "🍹",
          },
          {
            product_id: 8,
            product_name: "Strawberry Tea",
            size: "Medium",
            price: 5.5,
            is_available: true,
            category: "fruit-tea",
            image: "🍹",
          },
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
    { id: "all", name: "All Items", icon: "🌟" },
    { id: "milk-tea", name: "Milk Tea", icon: "🧋" },
    { id: "fruit-tea", name: "Fruit Tea", icon: "🍹" },
    { id: "specialty", name: "Specialty", icon: "🍵" },
  ];

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
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

  // Theme classes
  const bgClass = highContrast ? "bg-black" : "bg-white";
  const cardBgClass = highContrast
    ? "bg-gray-900 border-yellow-400 border-2"
    : "bg-white";
  const textClass = highContrast ? "text-yellow-300" : "text-gray-900";
  const mutedTextClass = highContrast ? "text-yellow-200" : "text-gray-600";
  const buttonClass = highContrast
    ? "bg-yellow-400 text-black hover:bg-yellow-300"
    : "bg-gray-900 text-white hover:bg-gray-800";
  const navButtonClass = highContrast
    ? "bg-gray-800 border-2 border-yellow-400 hover:bg-gray-700"
    : "bg-gray-100 hover:bg-gray-200";
  const navButtonActiveClass = highContrast
    ? "bg-yellow-400 text-black"
    : "bg-gray-900 text-white";
  const fontSizeClass =
    fontSize === "large"
      ? "text-xl"
      : fontSize === "xlarge"
      ? "text-2xl"
      : "text-base";

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

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Menu Section with Left Navigation */}
          <div
            className={`flex-1 ${cardBgClass} rounded-2xl overflow-hidden shadow-xl`}
          >
            <div className="flex h-[calc(100vh-200px)]">
              {/* Left Navigation Bar */}
              <div
                className={`w-48 ${
                  highContrast
                    ? "bg-gray-800 border-r-2 border-yellow-400"
                    : "bg-purple-50 border-r-2 border-purple-200"
                } p-4`}
              >
                <h2 className={`text-lg font-bold ${textClass} mb-4`}>
                  Categories
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full p-3 rounded-lg transition-all ${fontSizeClass} flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? navButtonActiveClass
                          : `${navButtonClass} ${textClass}`
                      }`}
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-semibold">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side - Scrollable Menu Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className={`text-center ${textClass} text-xl`}>
                    Loading menu...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                      <button
                        key={item.product_id}
                        onClick={() => addToCart(item)}
                        className={`${cardBgClass} ${
                          highContrast
                            ? "border-4 border-yellow-400"
                            : "border-2 border-gray-200"
                        } rounded-xl p-4 hover:shadow-lg transition-all`}
                        aria-label={`Add ${
                          item.product_name
                        } for $${item.price.toFixed(2)}`}
                      >
                        <div className="text-5xl mb-3">{item.image}</div>
                        <div
                          className={`font-bold ${textClass} ${fontSizeClass}`}
                        >
                          {item.product_name}
                        </div>
                        <div className={`${mutedTextClass} text-sm`}>
                          {item.size}
                        </div>
                        <div
                          className={`${mutedTextClass} text-xl mt-2 font-semibold`}
                        >
                          ${item.price.toFixed(2)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Cart - Right Side */}
          <div
            className={`w-96 ${cardBgClass} rounded-2xl p-6 shadow-xl h-[calc(100vh-200px)] flex flex-col`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${textClass}`}>Your Order</h2>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-red-500 hover:text-red-700 font-semibold text-sm"
                >
                  Clear All
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div
                className={`flex-1 flex items-center justify-center ${mutedTextClass} text-center`}
              >
                <div>
                  <div className="text-6xl mb-4">🛒</div>
                  <p className={fontSizeClass}>Your cart is empty</p>
                  <p className="text-sm mt-2">Add items to get started</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.cartId}
                      className={`flex justify-between items-center p-3 ${
                        highContrast ? "bg-gray-800" : "bg-gray-50"
                      } rounded-lg`}
                    >
                      <div className="flex-1">
                        <span
                          className={`${textClass} ${fontSizeClass} font-semibold block`}
                        >
                          {item.product_name}
                        </span>
                        <span className={`${mutedTextClass} text-sm`}>
                          {item.size}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`${mutedTextClass} ${fontSizeClass} font-semibold`}
                        >
                          ${item.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Remove ${item.product_name}`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className={`border-t-2 ${
                    highContrast ? "border-yellow-400" : "border-gray-200"
                  } pt-4`}
                >
                  <div className="flex justify-between mb-4">
                    <span className={`text-xl font-bold ${textClass}`}>
                      Total:
                    </span>
                    <span className={`text-xl font-bold ${textClass}`}>
                      ${getTotal()}
                    </span>
                  </div>
                  <button
                    className={`w-full ${buttonClass} py-4 rounded-lg font-bold text-xl transition-all`}
                  >
                    Checkout
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
