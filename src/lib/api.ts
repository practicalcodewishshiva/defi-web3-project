import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tidefall_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tidefall_auth_token');
      localStorage.removeItem('tidefall_user_id');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signin: async (walletAddress: string, message: string, signature: string) => {
    const res = await api.post('/auth/signin', {
      walletAddress,
      message,
      signature,
    });
    return res.data;
  },

  verify: async () => {
    const res = await api.get('/auth/verify');
    return res.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const res = await api.get('/users/profile');
    return res.data;
  },

  updateProfile: async (data: { username?: string; email?: string; bio?: string }) => {
    const res = await api.patch('/users/profile', data);
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/users/stats');
    return res.data;
  },

  getLeaderboard: async (limit = 100) => {
    const res = await api.get('/users/leaderboard', { params: { limit } });
    return res.data;
  },
};

export const heroAPI = {
  create: async (heroType: string, name?: string) => {
    const res = await api.post('/heroes', { heroType, name });
    return res.data;
  },

  getMyHeroes: async () => {
    const res = await api.get('/heroes');
    return res.data;
  },

  getHero: async (heroId: string) => {
    const res = await api.get(`/heroes/${heroId}`);
    return res.data;
  },

  equipArtifact: async (heroId: string, artifactId: string) => {
    const res = await api.post(`/heroes/${heroId}/artifacts/equip`, { artifactId });
    return res.data;
  },

  unequipArtifact: async (heroId: string, artifactId: string) => {
    const res = await api.post(`/heroes/${heroId}/artifacts/unequip`, { artifactId });
    return res.data;
  },
};

export const battleAPI = {
  startPvE: async (heroId: string) => {
    const res = await api.post('/battles/pve', { heroId });
    return res.data;
  },

  getHistory: async (limit = 50) => {
    const res = await api.get('/battles/history', { params: { limit } });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/battles/stats');
    return res.data;
  },

  getBattle: async (battleId: string) => {
    const res = await api.get(`/battles/${battleId}`);
    return res.data;
  },
};

export const artifactAPI = {
  getMyArtifacts: async () => {
    const res = await api.get('/artifacts');
    return res.data;
  },

  getArtifact: async (artifactId: string) => {
    const res = await api.get(`/artifacts/${artifactId}`);
    return res.data;
  },
};

export default api;
