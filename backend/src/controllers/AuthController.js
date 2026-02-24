const { generateToken } = require('../middleware/auth');
const { userService } = require('../services/UserService');
const { isValidEthereumAddress } = require('../utils/helpers');
const logger = require('../utils/logger');

const signin = async (req, res) => {
  try {
    const { walletAddress, message, signature } = req.body;

    if (!walletAddress || !message || !signature) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!isValidEthereumAddress(walletAddress)) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }

    const isValid = await userService.verifyWalletSignature(
      walletAddress,
      message,
      signature,
    );

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    let user = await userService.getUserByWallet(walletAddress);

    if (!user) {
      const username = `player_${walletAddress.slice(2, 8)}`;
      user = await userService.createUser(walletAddress, username);
      logger.info(`New user created: ${user.id}`);
    }

    const token = generateToken(user.id, user.walletAddress);

    res.status(200).json({
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    logger.error('Signin error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const verify = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    logger.error('Verify error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  signin,
  verify
};
