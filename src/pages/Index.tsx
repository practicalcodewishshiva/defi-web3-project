import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Swords, Shield, Gem, Wallet } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.png';
import tideShard from '@/assets/tide-shard.png';
import { useGame } from '@/contexts/GameContext';

const Index = () => {
  const { gameState, setWalletAddress } = useGame();

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        if (accounts[0]) {
          setWalletAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask to connect your wallet!');
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Guardians of Tidefall"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-gradient-gold animate-float">
            Guardians of Tidefall
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Battle mythical creatures, earn precious Tide Shards, and become the ultimate guardian of the realm.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {!gameState.walletAddress ? (
              <Button variant="hero" size="xl" onClick={connectWallet} className="gap-2">
                <Wallet className="h-5 w-5" />
                Connect Wallet to Play
              </Button>
            ) : (
              <>
                <Link to="/heroes">
                  <Button variant="hero" size="xl">
                    Choose Your Hero
                  </Button>
                </Link>
                {gameState.selectedHero && (
                  <Link to="/battle">
                    <Button variant="battle" size="xl" className="gap-2">
                      <Swords className="h-5 w-5" />
                      Enter Battle
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12 text-gradient-gold">
            Play & Own Your Adventure
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Choose Your Guardian"
              description="Select from three unique heroes, each with distinct abilities and playstyles."
            />
            <FeatureCard
              icon={Swords}
              title="Battle the Tides"
              description="Face off against waves of enemies in strategic combat encounters."
            />
            <FeatureCard
              icon={Gem}
              title="Earn Tide Shards"
              description="Victory rewards you with on-chain Tide Shards that you truly own."
              image={tideShard}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="card-fantasy rounded-2xl p-8 md:p-12 max-w-3xl mx-auto gold-glow">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Ready to Begin Your Journey?
            </h3>
            <p className="text-muted-foreground mb-6">
              Connect your wallet and choose your guardian to start earning rewards.
            </p>
            {!gameState.walletAddress ? (
              <Button variant="hero" size="lg" onClick={connectWallet}>
                Connect Wallet
              </Button>
            ) : (
              <Link to="/heroes">
                <Button variant="hero" size="lg">
                  Select Your Hero
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  image?: string;
}

function FeatureCard({ icon: Icon, title, description, image }: FeatureCardProps) {
  return (
    <div className="card-fantasy rounded-xl p-6 text-center hover:gold-glow transition-all duration-300 hover:-translate-y-1">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-10 h-10" />
        ) : (
          <Icon className="w-8 h-8 text-gold" />
        )}
      </div>
      <h3 className="font-display text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

export default Index;
