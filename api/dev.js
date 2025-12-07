import { app } from './index.js';

// Use 5052 to avoid conflicts. Ignore externally set PORT to guarantee this.
const PORT = 5052;
app.listen(PORT, () => {
  console.log(`[DEV] Server running on port ${PORT}`);
});
