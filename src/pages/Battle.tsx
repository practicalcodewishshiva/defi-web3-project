import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Swords, Trophy, Skull, Loader2, ArrowRight, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import tideShard from '@/assets/tide-shard.png';

type BattleState = 'idle' | 'fighting' | 'victory' | 'defeat';

const Battle = () => {
  const { gameState, battle, transactionState } = useGame();
  const [battleState, setBattleState] = useState<BattleState>('idle');
  const [lastReward, setLastReward] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const startBattle = async () => {
    // Double-click protection: check if already processing
    if (transactionState.isProcessing || battleState === 'fighting') {
      return;
    }

    if (!gameState.selectedHero || !gameState.walletAddress) {
      setError('Missing hero or wallet connection');
      return;
    }

    // Clear previous error
    setError(null);
    setBattleState('fighting');
    
    try {
      const result = await battle();
      
      if (result.won) {
        setLastReward(result.shardsEarned);
        setBattleState('victory');
      } else {
        setLastReward(0);
        setBattleState('defeat');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Battle failed';
      setError(errorMessage);
      setBattleState('idle');
    }
  };

  const resetBattle = () => {
    setBattleState('idle');
    setLastReward(0);
  };

  // No hero selected
  if (!gameState.selectedHero) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="card-fantasy rounded-2xl p-8 max-w-md mx-auto">
            <Users className="h-16 w-16 text-gold mx-auto mb-4 opacity-50" />
            <h2 className="font-display text-2xl font-bold mb-2 text-foreground">
              No Hero Selected
            </h2>
            <p className="text-muted-foreground mb-6">
              You must select a guardian before entering battle.
            </p>
            <Link to="/heroes">
              <Button variant="hero" className="gap-2">
                Choose Hero
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No wallet connected
  if (!gameState.walletAddress) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="card-fantasy rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="font-display text-2xl font-bold mb-2 text-foreground">
              Wallet Required
            </h2>
            <p className="text-muted-foreground">
              Connect your wallet to receive battle rewards.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">
            Battle Arena
          </h1>
          <p className="text-muted-foreground">
            Face the tides and claim your rewards
          </p>
        </div>

        {/* Battle Arena */}
        <div className="max-w-2xl mx-auto">
          {/* Hero Display */}
          <div
            className={cn(
              "card-fantasy rounded-2xl p-6 mb-8 transition-all duration-500",
              battleState === 'fighting' && "animate-battle-shake",
              battleState === 'victory' && "gold-glow-intense animate-victory",
              battleState === 'defeat' && "opacity-80 animate-defeat"
            )}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Hero Image */}
              <div className="relative">
                <div className={cn(
                  "w-40 h-40 rounded-xl overflow-hidden border-2 transition-all duration-300",
                  battleState === 'victory' ? "border-gold" : "border-gold/30"
                )}>
                  <img
                    src={gameState.selectedHero.image}
                    alt={gameState.selectedHero.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {battleState === 'victory' && (
                  <div className="absolute -top-2 -right-2 bg-gold rounded-full p-2 gold-glow">
                    <Trophy className="h-5 w-5 text-navy" />
                  </div>
                )}
              </div>

              {/* Hero Info */}
              <div className="flex-1 text-center md:text-left">
                <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                  {gameState.selectedHero.class}
                </span>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  {gameState.selectedHero.name}
                </h2>
                
                {/* Stats Summary */}
                <div className="flex justify-center md:justify-start gap-4 text-sm">
                  <span className="text-muted-foreground">
                    ATK: <span className="text-gold font-semibold">{gameState.selectedHero.attack}</span>
                  </span>
                  <span className="text-muted-foreground">
                    DEF: <span className="text-secondary font-semibold">{gameState.selectedHero.defense}</span>
                  </span>
                  <span className="text-muted-foreground">
                    SPD: <span className="text-cyan-glow font-semibold">{gameState.selectedHero.speed}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Battle Status */}
          <div className="text-center mb-8">
            {battleState === 'idle' && (
              <div className="card-fantasy rounded-xl p-6">
                <p className="text-muted-foreground mb-4">
                  Your guardian stands ready. Will you face the tides?
                </p>
                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                <Button 
                  variant="battle" 
                  size="xl" 
                  onClick={startBattle} 
                  disabled={transactionState.isProcessing}
                  className="gap-2"
                >
                  {transactionState.isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Swords className="h-5 w-5" />
                      Start Battle
                    </>
                  )}
                </Button>
                {transactionState.transactionHash && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Last TX: {transactionState.transactionHash.slice(0, 10)}...
                  </p>
                )}
              </div>
            )}

            {battleState === 'fighting' && (
              <div className="card-fantasy rounded-xl p-8">
                <Loader2 className="h-12 w-12 animate-spin text-gold mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Battle in Progress...
                </h3>
                <p className="text-muted-foreground mb-2">
                  Your guardian fights valiantly against the tides!
                </p>
                {transactionState.transactionHash && (
                  <p className="text-xs text-muted-foreground font-mono">
                    TX: {transactionState.transactionHash}
                  </p>
                )}
              </div>
            )}

            {battleState === 'victory' && (
              <div className="card-fantasy rounded-xl p-8 gold-glow">
                <Trophy className="h-16 w-16 text-gold mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-gold mb-2">
                  Victory!
                </h3>
                <p className="text-muted-foreground mb-4">
                  You have conquered the tides and earned your reward!
                </p>
                
                {/* Reward Display */}
                <div className="inline-flex items-center gap-3 bg-navy-light rounded-lg px-6 py-3 mb-6">
                  <img src={tideShard} alt="Tide Shard" className="w-10 h-10 animate-float" />
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Earned</p>
                    <p className="font-display text-xl font-bold text-cyan-glow">
                      +{lastReward} Tide Shard
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button 
                    variant="battle" 
                    onClick={startBattle} 
                    disabled={transactionState.isProcessing}
                    className="gap-2"
                  >
                    {transactionState.isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Swords className="h-4 w-4" />
                        Battle Again
                      </>
                    )}
                  </Button>
                  <Link to="/inventory">
                    <Button variant="outline" className="gap-2">
                      View Inventory
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                {transactionState.transactionHash && (
                  <p className="mt-4 text-xs text-muted-foreground font-mono break-all">
                    Transaction: {transactionState.transactionHash}
                  </p>
                )}
              </div>
            )}

            {battleState === 'defeat' && (
              <div className="card-fantasy rounded-xl p-8 border-destructive/30">
                <Skull className="h-16 w-16 text-destructive mx-auto mb-4 opacity-70" />
                <h3 className="font-display text-2xl font-bold text-destructive mb-2">
                  Defeat
                </h3>
                <p className="text-muted-foreground mb-6">
                  The tides were too strong this time. Rise again, guardian!
                </p>

                <div className="flex justify-center gap-4">
                  <Button 
                    variant="battle" 
                    onClick={startBattle} 
                    disabled={transactionState.isProcessing}
                    className="gap-2"
                  >
                    {transactionState.isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Swords className="h-4 w-4" />
                        Try Again
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetBattle}>
                    Return
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Battle Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-fantasy rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Shards</p>
              <p className="font-display text-2xl font-bold text-cyan-glow">
                {gameState.tideShards}
              </p>
            </div>
            <div className="card-fantasy rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Battles Fought</p>
              <p className="font-display text-2xl font-bold text-gold">
                {gameState.battleHistory.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
