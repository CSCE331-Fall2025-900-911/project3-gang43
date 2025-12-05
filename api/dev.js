import { app } from './index.js';

// Use a different port for the API dev server to avoid colliding with the
// main `server` process which also listens on 5050 when running concurrently.
// Use 5052 to avoid conflicts. Ignore externally set PORT to guarantee this.
const PORT = 5052;
app.listen(PORT, () => {
  console.log(`[DEV] Server running on port ${PORT}`);
});
