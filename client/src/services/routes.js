// Normalize VITE_API_URL and default to a relative /api when not set.
const rawApi = import.meta.env.VITE_API_URL || "";
const normalized = rawApi.replace(/\/+$/, ''); // remove trailing slashes
// If an absolute API host is provided, use it with the /api prefix. Otherwise use relative /api.
export const API_URL = normalized ? `${normalized}/api` : "/api";

console.log('[API Service] VITE_API_URL from env:', import.meta.env.VITE_API_URL);
console.log('[API Service] Normalized API_URL:', API_URL);

export async function getExampleData() {
  const res = await fetch(`${API_URL}/example`);
  return res.json();
}

// Product endpoints
export async function getAllProducts() {
  try {
    console.log('[API] Fetching all products from:', `${API_URL}/products`);
    const res = await fetch(`${API_URL}/products`);
    console.log('[API] Products response status:', res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[API] Products response error:', errorText);
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('[API] Products data received:', data.data?.length || 0, 'items');
    return data;
  } catch (error) {
    console.error('[API] Error fetching products:', error.message, error);
    throw error;
  }
}

export async function getProductsByCategory(category) {
  try {
    const url = `${API_URL}/products/category/${encodeURIComponent(category)}`;
    console.log('[API] Fetching products for category:', category, 'from:', url);
    const res = await fetch(url);
    console.log('[API] Category products response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[API] Category products error:', errorText);
      throw new Error(`HTTP ${res.status}: Failed to fetch products by category`);
    }
    
    const data = await res.json();
    console.log('[API] Category products received:', data.data?.length || 0, 'items');
    return data;
  } catch (error) {
    console.error('[API] Error fetching products by category:', error.message, error);
    throw error;
  }
}

export async function getCategories() {
  try {
    const url = `${API_URL}/products/categories/list`;
    console.log('[API] Fetching categories from:', url);
    const res = await fetch(url);
    console.log('[API] Categories response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[API] Categories response error:', errorText);
      throw new Error(`HTTP ${res.status}: Failed to fetch categories`);
    }
    
    const data = await res.json();
    console.log('[API] Categories received:', data.data || []);
    return data;
  } catch (error) {
    console.error('[API] Error fetching categories:', error.message, error);
    throw error;
  }
}

// Order endpoints
export async function checkoutOrder(items, totalAmount, subtotal, tax, cashierName) {
  try {
    const url = `${API_URL}/orders/checkout`;
    const payload = {
      items,
      totalAmount,
      subtotal,
      tax,
      cashierName,
    };
    
    console.log('[API] Processing checkout to:', url);
    console.log('[API] Checkout payload:', payload);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log('[API] Checkout response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('[API] Checkout error response:', errorText);
      throw new Error(`HTTP ${res.status}: Failed to process order`);
    }
    
    const data = await res.json();
    console.log('[API] Checkout successful, order ID:', data.data?.orderId);
    return data;
  } catch (error) {
    console.error('[API] Error processing order:', error.message, error);
    throw error;
  }
}

export async function getOrderHistory() {
  try {
    const res = await fetch(`${API_URL}/orders/history`);
    if (!res.ok) throw new Error('Failed to fetch order history');
    return await res.json();
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
}

export async function getOrderDetails(orderId) {
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}`);
    if (!res.ok) throw new Error('Failed to fetch order details');
    return await res.json();
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
}
