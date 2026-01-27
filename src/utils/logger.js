/**
 * Logger utility that respects environment settings
 * Logs are only shown in development mode
 * In production builds, these calls are removed by the build process
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

/**
 * Log an error message
 * @param {string} message - Error message
 * @param {Error|object} [error] - Error object or additional error data
 * @param {object} [context] - Additional context information
 */
export const logError = (message, error = null, context = {}) => {
  if (isDevelopment) {
    console.error(`[Error] ${message}`, {
      error,
      context,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Log a warning message
 * @param {string} message - Warning message
 * @param {object} [data] - Additional data
 */
export const logWarning = (message, data = {}) => {
  if (isDevelopment) {
    console.warn(`[Warning] ${message}`, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Log an info message
 * @param {string} message - Info message
 * @param {object} [data] - Additional data
 */
export const logInfo = (message, data = {}) => {
  if (isDevelopment) {
    // eslint-disable-next-line no-console
    console.log(`[Info] ${message}`, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Log a debug message
 * @param {string} message - Debug message
 * @param {object} [data] - Additional data
 */
export const logDebug = (message, data = {}) => {
  if (isDevelopment) {
    // eslint-disable-next-line no-console
    console.debug(`[Debug] ${message}`, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
};

export default {
  error: logError,
  warn: logWarning,
  info: logInfo,
  debug: logDebug,
  isDevelopment,
  isProduction,
};
