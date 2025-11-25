export const translations = {
  en: {
    bubblePOS: "BubblePOS",
    customerKiosk: "Customer Kiosk",
    cashier: "Cashier",
    downtownStore: "Downtown Store - Terminal #1",

    voiceOrder: "Voice Order",
    accessibility: "Accessibility",

    categories: "Categories",
    allItems: "All Items",
    milkTea: "Milk Tea",
    fruitTea: "Fruit Tea",
    smoothies: "Smoothies",
    coffee: "Coffee",
    toppings: "Toppings",
    snacks: "Snacks",
    specialty: "Specialty",

    searchItems: "Search items...",
    selection: "Selection",
    gridView: "Grid View",
    listView: "List View",

    currentOrder: "Current Order",
    order: "Order",
    noItems: "No items in cart",
    selectItems: "Select items to add to order",
    subtotal: "Subtotal",
    tax: "Tax",
    total: "Total",

    processPayment: "Process Payment",
    hold: "Hold",
    void: "Void",
    checkout: "Checkout",

    welcomeTo: "Welcome to",
    signIn: "Sign in to access your dashboard",
    continueDemo: "Continue as Demo User",
    demoMode: "Demo Mode",
    demoDescription: "Use the demo login to explore all features without authentication",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    agreeText: "By signing in, you agree to our",
    and: "and",

    loading: "Loading menu...",

    addedToCart: "Added to cart",
    removedFromCart: "Removed from cart"
  },
  es: {
    bubblePOS: "BubblePOS",
    customerKiosk: "Quiosco del Cliente",
    cashier: "Cajero",
    downtownStore: "Tienda Centro - Terminal #1",

    voiceOrder: "Orden por Voz",
    accessibility: "Accesibilidad",

    categories: "Categorías",
    allItems: "Todos los Artículos",
    milkTea: "Té con Leche",
    fruitTea: "Té de Frutas",
    smoothies: "Batidos",
    coffee: "Café",
    toppings: "Complementos",
    snacks: "Bocadillos",
    specialty: "Especialidad",

    searchItems: "Buscar artículos...",
    selection: "Selección",
    gridView: "Vista de Cuadrícula",
    listView: "Vista de Lista",

    currentOrder: "Orden Actual",
    order: "Orden",
    noItems: "No hay artículos en el carrito",
    selectItems: "Seleccione artículos para agregar",
    subtotal: "Subtotal",
    tax: "Impuesto",
    total: "Total",

    processPayment: "Procesar Pago",
    hold: "Retener",
    void: "Anular",
    checkout: "Pagar",

    welcomeTo: "Bienvenido a",
    signIn: "Inicia sesión para acceder",
    continueDemo: "Continuar como Usuario Demo",
    demoMode: "Modo Demo",
    demoDescription: "Use el inicio de sesión de demostración para explorar todas las funciones",
    termsOfService: "Términos de Servicio",
    privacyPolicy: "Política de Privacidad",
    agreeText: "Al iniciar sesión, aceptas nuestros",
    and: "y",

    loading: "Cargando menú...",

    addedToCart: "Agregado al carrito",
    removedFromCart: "Eliminado del carrito"
  }
};

export const getTranslation = (key, language = 'en') => {
  return translations[language]?.[key] || translations.en[key] || key;
};
