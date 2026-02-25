const User = require('./User');
const Hero = require('./Hero');
const Artifact = require('./Artifact');
const Battle = require('./Battle');
const InventoryItem = require('./InventoryItem');
const Guild = require('./Guild');
const GuildMember = require('./GuildMember');
const GuildWar = require('./GuildWar');
const Marketplace = require('./Marketplace');
const Achievement = require('./Achievement');
const GameConfig = require('./GameConfig');
const AuditLog = require('./AuditLog');

const initializeAssociations = () => {
  User.hasMany(Hero, { foreignKey: 'ownerId', as: 'heroes' });
  Hero.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

  User.hasMany(Artifact, { foreignKey: 'ownerId', as: 'artifacts' });
  Artifact.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

  Hero.hasMany(Artifact, { foreignKey: 'equippedToId', as: 'equippedArtifacts' });
  Artifact.belongsTo(Hero, { foreignKey: 'equippedToId', as: 'equippedTo' });

  User.hasMany(Battle, { foreignKey: 'playerId', as: 'battles' });
  Battle.belongsTo(User, { foreignKey: 'playerId', as: 'player' });

  User.hasMany(Battle, { foreignKey: 'opponentId', as: 'opponentBattles' });
  Battle.belongsTo(User, { foreignKey: 'opponentId', as: 'opponent' });

  Hero.hasMany(Battle, { foreignKey: 'playerHeroId', as: 'battleHistory' });
  Battle.belongsTo(Hero, { foreignKey: 'playerHeroId', as: 'playerHero' });

  User.hasMany(InventoryItem, { foreignKey: 'userId', as: 'inventory' });
  InventoryItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  Hero.hasMany(InventoryItem, { foreignKey: 'heroId', as: 'inventoryItems' });
  InventoryItem.belongsTo(Hero, { foreignKey: 'heroId', as: 'hero' });

  Artifact.hasMany(InventoryItem, { foreignKey: 'artifactId', as: 'inventoryItems' });
  InventoryItem.belongsTo(Artifact, { foreignKey: 'artifactId', as: 'artifact' });

  Guild.hasMany(GuildMember, { foreignKey: 'guildId', as: 'members' });
  GuildMember.belongsTo(Guild, { foreignKey: 'guildId', as: 'guild' });

  User.hasOne(GuildMember, { foreignKey: 'userId', as: 'guildMembership' });
  GuildMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  Guild.hasMany(GuildWar, { foreignKey: 'guild1Id', as: 'wars' });
  GuildWar.belongsTo(Guild, { foreignKey: 'guild1Id', as: 'guild1' });

  GuildWar.belongsTo(Guild, { foreignKey: 'guild2Id', as: 'guild2' });

  User.hasMany(Marketplace, { foreignKey: 'sellerId', as: 'marketplaceListings' });
  Marketplace.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

  Artifact.hasMany(Marketplace, { foreignKey: 'artifactId', as: 'marketplaceListings' });
  Marketplace.belongsTo(Artifact, { foreignKey: 'artifactId', as: 'artifact' });
};

module.exports = {
  User,
  Hero,
  Artifact,
  Battle,
  InventoryItem,
  Guild,
  GuildMember,
  GuildWar,
  Marketplace,
  Achievement,
  GameConfig,
  AuditLog,
  initializeAssociations,
};
