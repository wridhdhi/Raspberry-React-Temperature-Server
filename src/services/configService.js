const CONFIG_KEY = 'dashboardConfig';
const LAST_API_KEY = 'lastApiIp';

export const saveConfig = (config) => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving config:', error);
  }
};

export const loadConfig = () => {
  try {
    const config = localStorage.getItem(CONFIG_KEY);
    return config ? JSON.parse(config) : null;
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
};

export const getLastApiIp = () => {
  return localStorage.getItem(LAST_API_KEY) || '';
};

export const setLastApiIp = (ip) => {
  localStorage.setItem(LAST_API_KEY, ip);
};


// In configService.js
export const loadDefaultConfig = async () => {
    try {
      const response = await fetch('/config.json');
      return await response.json();
    } catch (error) {
      console.error('Error loading default config:', error);
      return {
        defaultApiIp: '10.22.197.212',
        maxCards: 5,
        cacheTTL: 3600
      };
    }
  };

  // In configService.js
export const validateCache = async (config) => {
    const defaultConfig = await loadDefaultConfig();
    const now = Date.now();
    
    return config.cards?.map(card => {
      if (!card.configured) return card;
      
      const lastUpdated = new Date(card.lastUpdated).getTime();
      const cacheValid = (now - lastUpdated) < (defaultConfig.cacheTTL * 1000);
      
      return cacheValid ? card : { ...card, configured: false };
    });
  };