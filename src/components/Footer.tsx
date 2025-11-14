import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const Footer = () => {
  const [progress, setProgress] = useState(67);
  const [activeShipments] = useState(143);
  const [clearedToday] = useState(89);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 60 : prev + Math.random() * 5));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Package className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold text-foreground">Active Shipments</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{activeShipments}</p>
            <p className="text-sm text-muted-foreground">Currently in processing</p>
          </div>
          
          <div>
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <h3 className="font-semibold text-foreground">Cleared Today</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{clearedToday}</p>
            <p className="text-sm text-muted-foreground">Shipments released</p>
          </div>
          
          <div>
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              <h3 className="font-semibold text-foreground">System Capacity</h3>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{Math.round(progress)}% utilized</p>
                <Badge variant="clearance" className="text-xs">Optimal</Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
            <div>
              <p>© 2025 SecureCustoms. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Security</a>
              <a href="#" className="hover:text-foreground">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
