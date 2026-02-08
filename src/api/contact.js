/**
 * Contact form API – submits form data to the Azure Function endpoint.
 * Decoupled from the Contact component for reuse and testability.
 */

import { logError, logWarning } from "../utils/logger";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:7071/api/ContactForm";
const FUNCTION_KEY = import.meta.env.VITE_FUNCTION_KEY || "";

/**
 * Build the request URL with optional function key as `code` query parameter.
 * @param {string} baseUrl
 * @param {string} functionKey
 * @returns {string} Final request URL, or throws on invalid config
 */
function buildRequestUrl(baseUrl, functionKey) {
  let requestUrl = baseUrl;
  if (functionKey) {
    let decodedKey = functionKey;
    try {
      if (functionKey.includes("%")) {
        decodedKey = decodeURIComponent(functionKey);
      }
    } catch (decodeError) {
      logWarning("Failed to decode function key, using original", {
        error: decodeError,
      });
      decodedKey = functionKey;
    }
    try {
      const url = new URL(requestUrl);
      url.searchParams.set("code", decodedKey);
      requestUrl = url.toString();
    } catch (urlError) {
      logError("Failed to build request URL", urlError, { apiUrl: baseUrl });
      throw new Error("Invalid API URL configuration");
    }
  }
  return requestUrl;
}

/**
 * Submit contact form data to the backend.
 * @param {{ name: string, email: string, message: string }} formData
 * @returns {Promise<{ ok: true, data: object }>} Resolves with response data on success
 * @throws {Error} On non-2xx response (message from server) or network/parse errors
 */
export async function submitContactForm(formData) {
  const requestUrl = buildRequestUrl(API_URL, FUNCTION_KEY);
  const headers = { "Content-Type": "application/json" };

  const response = await fetch(requestUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(formData),
  });

  let result;
  try {
    result = await response.json();
  } catch (jsonError) {
    logError("Failed to parse response as JSON", jsonError, {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("Invalid response from server");
  }

  if (response.ok) {
    return { ok: true, data: result };
  }

  const errorMessage =
    result.error || "Failed to send message. Please try again.";
  logError("Contact form submission failed", new Error(errorMessage), {
    status: response.status,
    statusText: response.statusText,
    responseData: result,
  });
  throw new Error(errorMessage);
}
