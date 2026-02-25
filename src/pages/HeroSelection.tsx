import { Link } from 'react-router-dom';
import { HeroCard } from '@/components/cards/HeroCard';
import { HEROES } from '@/lib/heroes';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Swords, ArrowRight } from 'lucide-react';

const HeroSelection = () => {
  const { gameState, selectHero } = useGame();

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient-gold">
            Choose Your Guardian
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Each guardian brings unique strengths to battle. Choose wisely, for your fate depends on it.
          </p>
        </div>

        {/* Hero Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {HEROES.map((hero) => (
            <HeroCard
              key={hero.id}
              hero={hero}
              isSelected={gameState.selectedHero?.id === hero.id}
              onSelect={selectHero}
            />
          ))}
        </div>

        {/* Action Buttons */}
        {gameState.selectedHero && (
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
              <div className="card-fantasy rounded-lg px-6 py-3">
                <span className="text-muted-foreground">Selected: </span>
                <span className="font-display font-bold text-gold">
                  {gameState.selectedHero.name}
                </span>
              </div>
              
              <Link to="/battle">
                <Button variant="hero" size="lg" className="gap-2">
                  <Swords className="h-5 w-5" />
                  Enter Battle
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Not Connected Warning */}
        {!gameState.walletAddress && (
          <div className="text-center">
            <div className="card-fantasy rounded-lg px-6 py-4 inline-block">
              <p className="text-muted-foreground">
                Connect your wallet to save your hero selection and enter battles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSelection;
