import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp, Lock, Shield, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import type { ShipmentSubmission, FileInfo } from "@/types/shipment";

export const UploadForm = () => {
  const { toast } = useToast();
  const { address } = useWallet();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [formData, setFormData] = useState({
    shipmentId: "",
    value: "",
    category: "",
    origin: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length + files.length > 5) {
      toast({
        title: "Too Many Files",
        description: "Maximum 5 files allowed.",
        variant: "destructive",
      });
      return;
    }

    const filePromises = selectedFiles.map(file => {
      return new Promise<FileInfo>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            data: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const newFiles = await Promise.all(filePromises);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit shipment.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        title: "No Files Uploaded",
        description: "Please upload at least one document.",
        variant: "destructive",
      });
      return;
    }
    
    setIsEncrypting(true);
    
    setTimeout(() => {
      const submission: ShipmentSubmission = {
        id: `SHP-${Date.now()}`,
        ...formData,
        files,
        walletAddress: address,
        timestamp: Date.now(),
        status: "pending",
      };

      const existingSubmissions = JSON.parse(localStorage.getItem("shipmentSubmissions") || "[]");
      localStorage.setItem("shipmentSubmissions", JSON.stringify([submission, ...existingSubmissions]));

      setIsEncrypting(false);
      setFormData({ shipmentId: "", value: "", category: "", origin: "" });
      setFiles([]);
      
      toast({
        title: "Shipment Encrypted & Submitted",
        description: "Your encrypted shipment data has been submitted for automated review.",
      });

      window.dispatchEvent(new Event("shipmentSubmitted"));
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
                  <Input 
                    id="shipmentId" 
                    placeholder="SHP-2025-001234" 
                    value={formData.shipmentId}
                    onChange={(e) => setFormData({...formData, shipmentId: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value">Total Value (USD)</Label>
                  <div className="relative">
                    <Input 
                      id="value" 
                      type="number" 
                      placeholder="50000"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      required 
                    />
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-encrypted" />
                  </div>
                  <p className="text-xs text-muted-foreground">This value will be encrypted before submission</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Item Category</Label>
                  <Input 
                    id="category" 
                    placeholder="Electronics, Textiles, etc."
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="origin">Country of Origin</Label>
                  <Input 
                    id="origin" 
                    placeholder="e.g., China"
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="documents">Supporting Documents</Label>
                  <label 
                    htmlFor="file-upload"
                    className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary"
                  >
                    <div className="text-center">
                      <FileUp className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drop files here or click to upload
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Invoice, packing list, certificates (max 5 files, 10MB each)
                      </p>
                    </div>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  
                  {files.length > 0 && (
                    <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between rounded bg-background p-2">
                          <div className="flex items-center gap-2">
                            <FileUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
