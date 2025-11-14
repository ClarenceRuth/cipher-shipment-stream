import { Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import customsLogo from "@/assets/customs-logo.png";
import { useWallet } from "@/hooks/useWallet";

export const Header = () => {
  const { address, isConnecting, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={customsLogo} alt="Customs Security" className="h-10 w-10" />
          <div>
            <h1 className="text-xl font-bold text-primary">SecureCustoms</h1>
            <p className="text-xs text-muted-foreground">Clear Goods Securely, Across Borders</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          {address ? (
            <Button variant="wallet" size="sm" onClick={disconnectWallet}>
              <Wallet className="mr-2 h-4 w-4" />
              {address.slice(0, 6)}...{address.slice(-4)}
            </Button>
          ) : (
            <Button variant="wallet" size="sm" onClick={connectWallet} disabled={isConnecting}>
              <Wallet className="mr-2 h-4 w-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
