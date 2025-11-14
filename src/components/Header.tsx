import { Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import customsLogo from "@/assets/customs-logo.png";

export const Header = () => {
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
          <Button variant="wallet" size="sm">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
};
