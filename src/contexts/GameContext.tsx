import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  GameState, 
  Hero, 
  getGameState, 
  selectHero as storeSelectHero,
  setWalletAddress as storeSetWalletAddress,
  mintTideShard,
  recordBattleLoss,
  defaultGameState
} from '@/lib/gameStore';

interface TransactionState {
  isProcessing: boolean;
  transactionHash: string | null;
  error: string | null;
}

interface GameContextType {
  gameState: GameState;
  selectHero: (hero: Hero) => void;
  setWalletAddress: (address: string | null) => void;
  battle: () => Promise<{ won: boolean; shardsEarned: number; transactionHash?: string }>;
  refreshState: () => void;
  transactionState: TransactionState;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [transactionState, setTransactionState] = useState<TransactionState>({
    isProcessing: false,
    transactionHash: null,
    error: null,
  });

  const refreshState = useCallback(() => {
    setGameState(getGameState());
  }, []);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const selectHero = useCallback((hero: Hero) => {
    const newState = storeSelectHero(hero);
    setGameState(newState);
  }, []);

  const setWalletAddress = useCallback((address: string | null) => {
    const newState = storeSetWalletAddress(address);
    setGameState(newState);
  }, []);

  const battle = useCallback(async (): Promise<{ won: boolean; shardsEarned: number; transactionHash?: string }> => {
    // Double-click protection: prevent concurrent battles
    if (transactionState.isProcessing) {
      throw new Error('Battle already in progress. Please wait.');
    }

    // Validate prerequisites
    if (!gameState.selectedHero) {
      throw new Error('No hero selected');
    }

    if (!gameState.walletAddress) {
      throw new Error('Wallet not connected');
    }

    // Set processing state
    setTransactionState({
      isProcessing: true,
      transactionHash: null,
      error: null,
    });

    try {
      // Simulate battle delay (in production, this would be an actual blockchain transaction)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Random win/loss based on hero stats (60% base win rate)
      const hero = gameState.selectedHero;
      let winChance = 0.6;
      
      if (hero) {
        // Adjust win chance based on hero stats
        const totalStats = hero.attack + hero.defense + hero.speed;
        winChance = 0.5 + (totalStats / 1000);
      }

      const won = Math.random() < winChance;

      // Generate mock transaction hash (in production, this comes from blockchain)
      const transactionHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2)}`;

      if (won && gameState.walletAddress) {
        // Simulate transaction: mint reward
        const result = mintTideShard(gameState.walletAddress);
        
        // In production: poll for transaction confirmation here
        // await pollTransactionConfirmation(transactionHash);
        
        setTransactionState({
          isProcessing: false,
          transactionHash,
          error: null,
        });
        
        refreshState();
        return { won: true, shardsEarned: 1, transactionHash };
      } else {
        // Record loss (no transaction needed)
        recordBattleLoss();
        
        setTransactionState({
          isProcessing: false,
          transactionHash: null,
          error: null,
        });
        
        refreshState();
        return { won: false, shardsEarned: 0 };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Battle failed';
      
      setTransactionState({
        isProcessing: false,
        transactionHash: null,
        error: errorMessage,
      });
      
      // Re-throw to allow component to handle
      throw error;
    }
  }, [gameState.selectedHero, gameState.walletAddress, transactionState.isProcessing, refreshState]);

  return (
    <GameContext.Provider value={{ 
      gameState, 
      selectHero, 
      setWalletAddress, 
      battle, 
      refreshState,
      transactionState,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
