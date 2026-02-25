const { ethers } = require('ethers');
const config = require('../config');
const logger = require('../utils/logger');

const ERC1155_ABI = [
  'function mint(address to, uint256 id, uint256 amount, bytes data) external',
  'function balanceOf(address account, uint256 id) external view returns (uint256)',
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external',
];

let provider;
let signer;
let artifactsContract;
let heroesContract;

const initializeBlockchain = async () => {
  try {
    provider = new ethers.JsonRpcProvider(config.blockchain.polygonMumbaiRpc);
    
    const wallet = new ethers.Wallet(
      config.blockchain.contractOwnerPrivateKey,
      provider,
    );
    signer = wallet;

    if (config.blockchain.contractAddressArtifacts) {
      artifactsContract = new ethers.Contract(
        config.blockchain.contractAddressArtifacts,
        ERC1155_ABI,
        signer,
      );
    }

    if (config.blockchain.contractAddressHeroes) {
      heroesContract = new ethers.Contract(
        config.blockchain.contractAddressHeroes,
        ERC1155_ABI,
        signer,
      );
    }

    logger.info('Blockchain initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize blockchain:', error);
    throw error;
  }
};

const mintArtifact = async (toAddress, tokenId, quantity = 1) => {
  try {
    if (!artifactsContract) {
      logger.warn('Artifacts contract not initialized, using mock');
      return `mock-tx-${Date.now()}`;
    }

    const tx = await artifactsContract.mint(
      toAddress,
      tokenId,
      quantity,
      '0x',
    );

    await tx.wait();
    logger.info(`Minted artifact ${tokenId} to ${toAddress}`);
    return tx.hash;
  } catch (error) {
    logger.error('Error minting artifact:', error);
    throw error;
  }
};

const mintHero = async (toAddress, heroTokenId) => {
  try {
    if (!heroesContract) {
      logger.warn('Heroes contract not initialized, using mock');
      return `mock-hero-tx-${Date.now()}`;
    }

    const tx = await heroesContract.mint(
      toAddress,
      heroTokenId,
      1,
      '0x',
    );

    await tx.wait();
    logger.info(`Minted hero ${heroTokenId} to ${toAddress}`);
    return tx.hash;
  } catch (error) {
    logger.error('Error minting hero:', error);
    throw error;
  }
};

const getArtifactBalance = async (walletAddress, tokenId) => {
  try {
    if (!artifactsContract) {
      logger.warn('Artifacts contract not initialized, returning 0');
      return 0;
    }

    const balance = await artifactsContract.balanceOf(walletAddress, tokenId);
    return Number(balance);
  } catch (error) {
    logger.error('Error getting artifact balance:', error);
    return 0;
  }
};

const getHeroBalance = async (walletAddress, heroTokenId) => {
  try {
    if (!heroesContract) {
      logger.warn('Heroes contract not initialized, returning 0');
      return 0;
    }

    const balance = await heroesContract.balanceOf(walletAddress, heroTokenId);
    return Number(balance);
  } catch (error) {
    logger.error('Error getting hero balance:', error);
    return 0;
  }
};

const verifyWalletSignature = async (walletAddress, message, signature) => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    logger.error('Error verifying signature:', error);
    return false;
  }
};

const getProvider = () => {
  if (!provider) {
    throw new Error('Blockchain not initialized');
  }
  return provider;
};

const getSigner = () => {
  if (!signer) {
    throw new Error('Blockchain not initialized');
  }
  return signer;
};

module.exports = {
  initializeBlockchain,
  mintArtifact,
  mintHero,
  getArtifactBalance,
  getHeroBalance,
  verifyWalletSignature,
  getProvider,
  getSigner,
};
