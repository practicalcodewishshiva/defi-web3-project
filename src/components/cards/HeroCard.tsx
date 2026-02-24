import { Hero } from '@/lib/gameStore';
import { Button } from '@/components/ui/button';
import { Shield, Sword, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroCardProps {
  hero: Hero;
  isSelected: boolean;
  onSelect: (hero: Hero) => void;
}

export function HeroCard({ hero, isSelected, onSelect }: HeroCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-500",
        "card-fantasy",
        isSelected ? "gold-glow-intense scale-105 border-gold" : "hover:scale-102 hover:gold-glow"
      )}
    >
      {/* Selection Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 bg-gold rounded-full p-1.5">
          <Check className="h-4 w-4 text-navy" />
        </div>
      )}

      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-10" />
        <img
          src={hero.image}
          alt={hero.name}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Hero Info */}
      <div className="p-5">
        <div className="mb-1">
          <span className="text-xs font-semibold text-gold uppercase tracking-wider">
            {hero.class}
          </span>
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-4">
          {hero.name}
        </h3>

        {/* Stats */}
        <div className="space-y-2 mb-5">
          <StatBar icon={Sword} label="Attack" value={hero.attack} color="gold" />
          <StatBar icon={Shield} label="Defense" value={hero.defense} color="secondary" />
          <StatBar icon={Zap} label="Speed" value={hero.speed} color="cyan" />
        </div>

        {/* Select Button */}
        <Button
          variant={isSelected ? "default" : "outline"}
          className="w-full"
          onClick={() => onSelect(hero)}
        >
          {isSelected ? 'Selected' : 'Select Hero'}
        </Button>
      </div>
    </div>
  );
}

interface StatBarProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: 'gold' | 'secondary' | 'cyan';
}

function StatBar({ icon: Icon, label, value, color }: StatBarProps) {
  const colorClasses = {
    gold: 'bg-gold',
    secondary: 'bg-secondary',
    cyan: 'bg-cyan-glow',
  };

  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("h-4 w-4", color === 'gold' ? 'text-gold' : color === 'secondary' ? 'text-secondary' : 'text-cyan-glow')} />
      <span className="text-xs text-muted-foreground w-14">{label}</span>
      <div className="flex-1 h-2 bg-navy-lighter rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorClasses[color])}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground w-8 text-right">{value}</span>
    </div>
  );
}
