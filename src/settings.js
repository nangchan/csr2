// application settings configured here
// ====================================
export const STUB_EPIC = true;
export const STUB_DELAY = 500;

// used in useDebounce
// set it low engouth for better responsiveness
// but high enough to not slow-down typing
export const DEBOUNCE_TIMEOUT = 50;

// auth token valid for 24 hours (1 day * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
export const AUTH_TOKEN_EXPIRATION_DURATION = 1 * 24 * 60 * 60 * 1000;

// external Rest API
export const BOINGO_EXTERNAL_API = 'https://example.com';

// Sitecore end-point for auth via AD (qa staging since prod not yet validated)
export const SITECORE_URL = 'https://example.com';

// application settings from environmental variables and .env
// ==========================================================
export const NODE_ENV = process.env.NODE_ENV;
export const NODE_ENV_ENUM = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
}; // enum for NODE_ENV

export const REACT_APP_HOST_TYPE = process.env.REACT_APP_HOST_TYPE;
export const REACT_APP_HOST_TYPE_ENUM = {
  LIVE: 'live',
  STAGING: 'staging',
}; // enum for REACT_APP_HOST_TYPE

export const REACT_APP_HOST_COLOR = process.env.REACT_APP_HOST_COLOR;
export const REACT_APP_HOST_COLOR_ENUM = {
  GREEN: 'green',
  BLUE: 'blue',
}; // enum for REACT_APP_HOST_COLOR