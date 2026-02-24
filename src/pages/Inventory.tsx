import { Link } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Package, Swords, Wallet, Trophy, Skull } from 'lucide-react';
import tideShard from '@/assets/tide-shard.png';
import { cn } from '@/lib/utils';

const Inventory = () => {
  const { gameState } = useGame();

  const totalBattles = gameState.battleHistory.length;
  const victories = gameState.battleHistory.filter(b => b.won).length;
  const winRate = totalBattles > 0 ? Math.round((victories / totalBattles) * 100) : 0;

  // Not connected
  if (!gameState.walletAddress) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="card-fantasy rounded-2xl p-8 max-w-md mx-auto">
            <Wallet className="h-16 w-16 text-gold mx-auto mb-4 opacity-50" />
            <h2 className="font-display text-2xl font-bold mb-2 text-foreground">
              Wallet Required
            </h2>
            <p className="text-muted-foreground">
              Connect your wallet to view your inventory.
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
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">
            Your Inventory
          </h1>
          <p className="text-muted-foreground">
            View your collected treasures and battle statistics
          </p>
        </div>

        {/* Wallet Info */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="card-fantasy rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 text-gold" />
              <div>
                <p className="text-xs text-muted-foreground">Connected Wallet</p>
                <p className="font-mono text-sm text-foreground">
                  {gameState.walletAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Tide Shards */}
          <div className="card-fantasy rounded-2xl p-6 gold-glow">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gold" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Tide Shards
              </h2>
            </div>

            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <img
                  src={tideShard}
                  alt="Tide Shard"
                  className={cn(
                    "w-32 h-32",
                    gameState.tideShards > 0 && "animate-float"
                  )}
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-navy-light border border-cyan-glow/50 rounded-full px-4 py-1">
                  <span className="font-display text-2xl font-bold text-cyan-glow">
                    {gameState.tideShards}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {gameState.tideShards > 0 
                  ? "Your shards shimmer with the power of the tides."
                  : "No shards yet. Win battles to earn them!"}
              </p>
              
              {gameState.tideShards === 0 && (
                <Link to="/battle">
                  <Button variant="battle" size="sm" className="gap-2">
                    <Swords className="h-4 w-4" />
                    Start Battling
                  </Button>
                </Link>
              )}
            </div>

            {/* ERC1155 Info */}
            <div className="mt-4 pt-4 border-t border-gold/20">
              <p className="text-xs text-muted-foreground text-center">
                ERC-1155 Token (Mock) • Owned on-chain
              </p>
            </div>
          </div>

          {/* Battle Statistics */}
          <div className="card-fantasy rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="h-5 w-5 text-gold" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Battle Statistics
              </h2>
            </div>

            <div className="space-y-4">
              <StatRow label="Total Battles" value={totalBattles} />
              <StatRow label="Victories" value={victories} icon={Trophy} iconColor="text-gold" />
              <StatRow label="Defeats" value={totalBattles - victories} icon={Skull} iconColor="text-destructive" />
              <StatRow label="Win Rate" value={`${winRate}%`} highlight />
              <StatRow label="Total Shards Earned" value={gameState.tideShards} highlight />
            </div>

            {totalBattles === 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No battles fought yet.
                </p>
                <Link to="/battle">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Swords className="h-4 w-4" />
                    Enter Arena
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Battles */}
        {gameState.battleHistory.length > 0 && (
          <div className="max-w-3xl mx-auto mt-8">
            <div className="card-fantasy rounded-2xl p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Recent Battles
              </h2>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[...gameState.battleHistory].reverse().slice(0, 10).map((battle) => (
                  <div
                    key={battle.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      battle.won ? "bg-gold/5 border border-gold/20" : "bg-destructive/5 border border-destructive/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {battle.won ? (
                        <Trophy className="h-4 w-4 text-gold" />
                      ) : (
                        <Skull className="h-4 w-4 text-destructive" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        battle.won ? "text-gold" : "text-destructive"
                      )}>
                        {battle.won ? 'Victory' : 'Defeat'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {battle.shardsEarned > 0 && (
                        <span className="text-sm text-cyan-glow">
                          +{battle.shardsEarned} shard
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(battle.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatRowProps {
  label: string;
  value: number | string;
  icon?: React.ElementType;
  iconColor?: string;
  highlight?: boolean;
}

function StatRow({ label, value, icon: Icon, iconColor, highlight }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gold/10 last:border-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon className={cn("h-4 w-4", iconColor)} />}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className={cn(
        "font-display font-semibold",
        highlight ? "text-gold text-lg" : "text-foreground"
      )}>
        {value}
      </span>
    </div>
  );
}

export default Inventory;
