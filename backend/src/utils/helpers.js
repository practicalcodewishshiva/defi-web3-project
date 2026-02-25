const { BATTLE_CONSTANTS, RARITY_STAT_BONUS } = require('../constants');

const isValidEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const calculateWinProbability = (playerStats, opponentStats) => {
  const ratio = playerStats / (playerStats + opponentStats);
  return Math.max(0.2, Math.min(0.8, ratio));
};

const calculateEloChange = (playerElo, opponentElo, playerWon) => {
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const actualScore = playerWon ? 1 : 0;
  const change = BATTLE_CONSTANTS.ELO_BASE_CHANGE * (actualScore - expectedScore);
  return Math.round(change);
};

const calculateRewards = (won, playerElo, difficulty = 1) => {
  if (!won) return { gold: 0, shards: 0 };

  const baseGold = BATTLE_CONSTANTS.BASE_REWARD * difficulty;
  const eloMultiplier = Math.max(0.5, playerElo / 1500);
  const gold = Math.round(baseGold * eloMultiplier);
  const shards = BATTLE_CONSTANTS.SHARD_REWARD;

  return { gold, shards };
};

const calculateArtifactStats = (baseStats, rarity) => {
  const multiplier = RARITY_STAT_BONUS[rarity];
  return {
    attack: Math.round(baseStats.attack * multiplier),
    defense: Math.round(baseStats.defense * multiplier),
    speed: Math.round(baseStats.speed * multiplier),
  };
};

const calculateNextLevelExp = (currentLevel) => {
  return Math.round(100 * Math.pow(1.1, currentLevel));
};

const getMarketplaceFee = (price) => {
  return Math.round(price * BATTLE_CONSTANTS.MARKETPLACE_FEE);
};

const generateRandomId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const paginate = (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

const buildResponse = (success, data, error) => ({
  success,
  data,
  error,
});

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

module.exports = {
  isValidEthereumAddress,
  shortenAddress,
  calculateWinProbability,
  calculateEloChange,
  calculateRewards,
  calculateArtifactStats,
  calculateNextLevelExp,
  getMarketplaceFee,
  generateRandomId,
  sleep,
  paginate,
  buildResponse,
  getRandomElement,
};
