import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UploadForm = () => {
  const { toast } = useToast();
  const [isEncrypting, setIsEncrypting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEncrypting(true);
    
    setTimeout(() => {
      setIsEncrypting(false);
      toast({
        title: "Shipment Encrypted & Submitted",
        description: "Your encrypted shipment data has been submitted for automated review.",
      });
    }, 2000);
  };

  return (
    <section className="bg-muted/50 py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Declare New Shipment</CardTitle>
                  <CardDescription>Submit encrypted shipment details for clearance</CardDescription>
                </div>
                <Badge variant="encrypted" className="text-xs">
                  <Lock className="mr-1 h-3 w-3" />
                  End-to-End Encrypted
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shipmentId">Shipment ID</Label>
                  <Input id="shipmentId" placeholder="SHP-2025-001234" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value">Total Value (USD)</Label>
                  <div className="relative">
                    <Input id="value" type="number" placeholder="50000" required />
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-encrypted" />
                  </div>
                  <p className="text-xs text-muted-foreground">This value will be encrypted before submission</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Item Category</Label>
                  <Input id="category" placeholder="Electronics, Textiles, etc." required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="origin">Country of Origin</Label>
                  <Input id="origin" placeholder="e.g., China" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documents">Supporting Documents</Label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary">
                    <div className="text-center">
                      <FileUp className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drop files here or click to upload
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Invoice, packing list, certificates (max 10MB each)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg bg-secondary/10 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 text-secondary" />
                    <div>
                      <h4 className="mb-1 text-sm font-semibold text-foreground">Security Notice</h4>
                      <p className="text-xs text-muted-foreground">
                        All sensitive data will be encrypted using your wallet's public key. 
                        Only authorized customs officers can decrypt when necessary for review.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  variant="secure" 
                  className="w-full" 
                  size="lg"
                  disabled={isEncrypting}
                >
                  {isEncrypting ? (
                    <>
                      <Lock className="mr-2 h-5 w-5 animate-pulse-glow" />
                      Encrypting & Submitting...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Encrypt & Submit for Clearance
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
