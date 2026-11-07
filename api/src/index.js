const { app } = require('@azure/functions');

/**
 * Minimal HTTP function for the Static Web App managed API (e.g. health).
 * Contact form submissions use the external Azure Function (see VITE_API_URL).
 */
app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (_request, _context) => {
    return {
      status: 200,
      body: JSON.stringify({ ok: true, message: 'API is available' }),
      headers: { 'Content-Type': 'application/json' },
    };
  },
});
