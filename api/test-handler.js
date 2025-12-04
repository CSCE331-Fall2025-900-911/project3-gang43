// Minimal test handler to verify Vercel function execution works
export default async function handler(req, res) {
  console.log('[TestHandler] Invoked');
  res.status(200).json({ success: true, message: 'test handler works' });
}
