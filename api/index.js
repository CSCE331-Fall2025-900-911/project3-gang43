// Vercel serverless handler for the Boba POS API
// This file is the entry point for all /api/* requests in production

export default async function handler(req, res) {
  try {
    // Log the request
    console.log(`[Handler] ${req.method} ${req.url}`);

    // Only respond with minimal info first - test if handler is even being called
    if (req.url === '/health') {
      console.log('[Handler] health check requested');
      return res.status(200).json({ success: true, message: 'Handler works' });
    }

    // For now, return a placeholder for all other requests
    return res.status(200).json({ success: true, message: 'API is under construction' });

  } catch (error) {
    console.error('[Handler] Error:', error && error.message ? error.message : error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error && error.message ? error.message : String(error)
    });
  }
}

