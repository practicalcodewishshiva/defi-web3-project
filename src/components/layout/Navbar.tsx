import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Swords, Package, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';
import tideShard from '@/assets/tide-shard.png';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/heroes', label: 'Heroes', icon: Users },
  { path: '/battle', label: 'Battle', icon: Swords },
  { path: '/inventory', label: 'Inventory', icon: Package },
];

export function Navbar() {
  const location = useLocation();
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

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gold/20 bg-navy/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-gradient-gold">
              Tidefall
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-2",
                      isActive && "bg-gold/10 text-gold"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Wallet & Shards */}
          <div className="flex items-center gap-4">
            {/* Shard Count */}
            {gameState.walletAddress && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-light border border-cyan-glow/30">
                <img src={tideShard} alt="Tide Shard" className="w-5 h-5" />
                <span className="font-display text-cyan-glow font-semibold">
                  {gameState.tideShards}
                </span>
              </div>
            )}

            {/* Wallet Button */}
            {gameState.walletAddress ? (
              <Button
                variant="connect"
                size="sm"
                onClick={disconnectWallet}
                className="gap-2"
              >
                <Wallet className="h-4 w-4" />
                {shortenAddress(gameState.walletAddress)}
              </Button>
            ) : (
              <Button
                variant="connect"
                size="sm"
                onClick={connectWallet}
                className="gap-2"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center gap-2 pb-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1 text-xs",
                    isActive && "bg-gold/10 text-gold"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
