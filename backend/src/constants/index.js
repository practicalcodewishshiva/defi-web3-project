const HERO_TYPES = {
  GUARDIAN_KNIGHT: 'guardian-knight',
  STORM_ARCHER: 'storm-archer',
  ARCANE_MAGE: 'arcane-mage',
};

const HERO_STATS = {
  'guardian-knight': {
    attack: 70,
    defense: 95,
    speed: 50,
  },
  'storm-archer': {
    attack: 85,
    defense: 55,
    speed: 90,
  },
  'arcane-mage': {
    attack: 95,
    defense: 45,
    speed: 70,
  },
};

const ITEM_RARITY = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  EPIC: 4,
  LEGENDARY: 5,
};

const RARITY_DROP_RATES = {
  1: 0.70,
  2: 0.20,
  3: 0.08,
  4: 0.018,
  5: 0.002,
};

const RARITY_STAT_BONUS = {
  1: 1.05,
  2: 1.10,
  3: 1.15,
  4: 1.20,
  5: 1.30,
};

const BATTLE_CONSTANTS = {
  BASE_WIN_CHANCE: 0.5,
  BASE_REWARD: 10,
  SHARD_REWARD: 1,
  ELO_BASE_CHANGE: 32,
  PVE_REWARD_MULTIPLIER: 1,
  PVP_REWARD_MULTIPLIER: 1.5,
  MARKETPLACE_FEE: 0.025,
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};

const ERROR_MESSAGES = {
  INVALID_SIGNATURE: 'Invalid wallet signature',
  UNAUTHORIZED: 'Unauthorized access',
  USER_NOT_FOUND: 'User not found',
  HERO_NOT_FOUND: 'Hero not found',
  ARTIFACT_NOT_FOUND: 'Artifact not found',
  BATTLE_NOT_FOUND: 'Battle not found',
  GUILD_NOT_FOUND: 'Guild not found',
  INVALID_INPUT: 'Invalid input data',
  ALREADY_EXISTS: 'Resource already exists',
  INSUFFICIENT_FUNDS: 'Insufficient funds',
  HERO_IN_COOLDOWN: 'Hero is in battle cooldown',
  INTERNAL_ERROR: 'Internal server error',
};

const SUCCESS_MESSAGES = {
  BATTLE_WON: 'Battle won successfully',
  BATTLE_LOST: 'Battle lost',
  HERO_CREATED: 'Hero created successfully',
  ARTIFACT_EQUIPPED: 'Artifact equipped successfully',
  ARTIFACT_UNEQUIPPED: 'Artifact unequipped successfully',
  MARKETPLACE_LISTED: 'Item listed on marketplace',
  MARKETPLACE_DELISTED: 'Item delisted from marketplace',
  MARKETPLACE_PURCHASED: 'Item purchased successfully',
};

const GUILD_ROLES = {
  LEADER: 'LEADER',
  OFFICER: 'OFFICER',
  MEMBER: 'MEMBER',
};

const BATTLE_TYPE = {
  PVE: 'PvE',
  PVP: 'PvP',
  GUILD_WAR: 'GUILD_WAR',
};

const MAX_ARTIFACTS_PER_HERO = 3;
const HERO_LEVEL_CAP = 100;
const EXPERIENCE_PER_LEVEL_BASE = 100;

module.exports = {
  HERO_TYPES,
  HERO_STATS,
  ITEM_RARITY,
  RARITY_DROP_RATES,
  RARITY_STAT_BONUS,
  BATTLE_CONSTANTS,
  PAGINATION,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  GUILD_ROLES,
  BATTLE_TYPE,
  MAX_ARTIFACTS_PER_HERO,
  HERO_LEVEL_CAP,
  EXPERIENCE_PER_LEVEL_BASE,
};
