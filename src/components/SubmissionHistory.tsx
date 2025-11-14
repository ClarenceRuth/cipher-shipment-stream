import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUp, Package } from "lucide-react";
import type { ShipmentSubmission } from "@/types/shipment";

export const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState<ShipmentSubmission[]>([]);

  const loadSubmissions = () => {
    const saved = localStorage.getItem("shipmentSubmissions");
    if (saved) {
      setSubmissions(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadSubmissions();
    
    const handleNewSubmission = () => {
      loadSubmissions();
    };

    window.addEventListener("shipmentSubmitted", handleNewSubmission);
    return () => window.removeEventListener("shipmentSubmitted", handleNewSubmission);
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "approved": return "success";
      case "rejected": return "destructive";
      default: return "warning";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (submissions.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Submission History
            </CardTitle>
            <CardDescription>Track your encrypted shipment declarations</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div 
                    key={submission.id} 
                    className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{submission.shipmentId}</h3>
                          <Badge variant={getStatusVariant(submission.status)}>
                            {submission.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Value:</span> ${submission.value}
                          </div>
                          <div>
                            <span className="font-medium">Category:</span> {submission.category}
                          </div>
                          <div>
                            <span className="font-medium">Origin:</span> {submission.origin}
                          </div>
                          <div>
                            <span className="font-medium">Submitted:</span> {formatDate(submission.timestamp)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileUp className="h-4 w-4" />
                          <span>{submission.files.length} document{submission.files.length !== 1 ? 's' : ''}</span>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Wallet: {submission.walletAddress.slice(0, 6)}...{submission.walletAddress.slice(-4)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
