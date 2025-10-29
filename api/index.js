module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.statusCode = 200;
  res.end(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello from Vercel</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; margin: 2rem; }
      h1 { color: #0f172a; }
      p { color: #334155; }
    </style>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>Your app is now served by a Vercel serverless function at <code>/api</code> and rewritten to <code>/</code>.</p>
  </body>
</html>`);
};
