// Mural API Configuration

export const MURAL_API_CONFIG = {
  API_KEY: import.meta.env.VITE_MURAL_API_KEY,
  API_URL: import.meta.env.VITE_MURAL_API_URL
};

console.log(MURAL_API_CONFIG);

if (!MURAL_API_CONFIG.API_KEY) {
  throw new Error('MURAL_API_KEY is not set');
}

if (!MURAL_API_CONFIG.API_URL) {
  throw new Error('MURAL_API_URL is not set');
}

export default MURAL_API_CONFIG; 