import { ShieldCheck, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary py-20">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-background/10 px-4 py-2 text-primary-foreground backdrop-blur">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Encrypted Border Clearance</span>
          </div>
          
          <h1 className="mb-6 text-5xl font-bold text-primary-foreground md:text-6xl">
            Clear Goods Securely,
            <br />
            Across Borders
          </h1>
          
          <p className="mb-8 text-lg text-primary-foreground/90">
            Upload encrypted shipment values and item categories for automated clearance review.
            Customs officers decrypt only when necessary. Full transparency, maximum security.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="wallet" size="lg" className="shadow-xl">
              <Lock className="mr-2 h-5 w-5" />
              Start Secure Clearance
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 bg-background/10 text-primary-foreground backdrop-blur hover:bg-background/20">
              <Zap className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "End-to-End Encryption", desc: "All shipment data encrypted at rest and in transit" },
            { icon: Lock, title: "Selective Decryption", desc: "Officers decrypt only when review is required" },
            { icon: Zap, title: "Instant Clearance", desc: "Automated processing for compliant shipments" },
          ].map((feature, i) => (
            <div key={i} className="group rounded-lg bg-background/10 p-6 backdrop-blur transition-all hover:bg-background/20 hover:shadow-xl">
              <feature.icon className="mb-4 h-10 w-10 text-accent" />
              <h3 className="mb-2 text-lg font-semibold text-primary-foreground">{feature.title}</h3>
              <p className="text-sm text-primary-foreground/80">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/10" />
    </section>
  );
};
