// Game State Management using localStorage (mock blockchain)

export interface Hero {
  id: string;
  name: string;
  class: string;
  attack: number;
  defense: number;
  speed: number;
  image: string;
}

export interface GameState {
  selectedHero: Hero | null;
  tideShards: number;
  battleHistory: BattleResult[];
  walletAddress: string | null;
}

export interface BattleResult {
  id: string;
  heroId: string;
  won: boolean;
  shardsEarned: number;
  timestamp: number;
}

const STORAGE_KEY = 'tidefall_game_state';

export const defaultGameState: GameState = {
  selectedHero: null,
  tideShards: 0,
  battleHistory: [],
  walletAddress: null,
};

export function getGameState(): GameState {
  if (typeof window === 'undefined') return defaultGameState;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultGameState;
  
  try {
    return JSON.parse(stored);
  } catch {
    return defaultGameState;
  }
}

export function saveGameState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function selectHero(hero: Hero): GameState {
  const state = getGameState();
  state.selectedHero = hero;
  saveGameState(state);
  return state;
}

export function setWalletAddress(address: string | null): GameState {
  const state = getGameState();
  state.walletAddress = address;
  saveGameState(state);
  return state;
}

// Mock ERC1155 mint function
export function mintTideShard(address: string): { success: boolean; newBalance: number } {
  const state = getGameState();
  state.tideShards += 1;
  
  const battleResult: BattleResult = {
    id: `battle_${Date.now()}`,
    heroId: state.selectedHero?.id || 'unknown',
    won: true,
    shardsEarned: 1,
    timestamp: Date.now(),
  };
  
  state.battleHistory.push(battleResult);
  saveGameState(state);
  
  return { success: true, newBalance: state.tideShards };
}

export function recordBattleLoss(): void {
  const state = getGameState();
  
  const battleResult: BattleResult = {
    id: `battle_${Date.now()}`,
    heroId: state.selectedHero?.id || 'unknown',
    won: false,
    shardsEarned: 0,
    timestamp: Date.now(),
  };
  
  state.battleHistory.push(battleResult);
  saveGameState(state);
}

export function getShardBalance(): number {
  return getGameState().tideShards;
}

export function resetGameState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
