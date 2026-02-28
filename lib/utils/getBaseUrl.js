// /lib/utils/getBaseUrl.js
export function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://interio97.in`;
  }

  return "http://localhost:3000";
}