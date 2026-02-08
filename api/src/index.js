const { app } = require('@azure/functions');

/**
 * Minimal HTTP function so the Static Web App has "at least one function",
 * which enables Application Insights for the SWA and removes the warning.
 * Contact form submissions continue to use the external Azure Function.
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
