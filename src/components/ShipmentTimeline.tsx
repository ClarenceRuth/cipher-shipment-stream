import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Lock, Package, Truck } from "lucide-react";

type TimelineStep = {
  id: string;
  title: string;
  status: "completed" | "current" | "pending";
  encrypted: boolean;
  timestamp?: string;
  icon: any;
};

const timelineSteps: TimelineStep[] = [
  {
    id: "1",
    title: "Shipment Declared",
    status: "completed",
    encrypted: true,
    timestamp: "2025-11-12 14:23",
    icon: Package,
  },
  {
    id: "2",
    title: "Encrypted Data Submitted",
    status: "completed",
    encrypted: true,
    timestamp: "2025-11-12 14:24",
    icon: Lock,
  },
  {
    id: "3",
    title: "Automated Risk Assessment",
    status: "current",
    encrypted: false,
    icon: Clock,
  },
  {
    id: "4",
    title: "Customs Clearance",
    status: "pending",
    encrypted: false,
    icon: CheckCircle2,
  },
  {
    id: "5",
    title: "Goods Released",
    status: "pending",
    encrypted: false,
    icon: Truck,
  },
];

export const ShipmentTimeline = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">Live Clearance Timeline</h2>
          <p className="text-muted-foreground">Track your shipment's journey through secure customs processing</p>
        </div>
        
        <div className="relative mx-auto max-w-4xl">
          {/* Timeline connector */}
          <div className="absolute left-8 top-0 h-full w-0.5 bg-border md:left-1/2" />
          
          <div className="space-y-8">
            {timelineSteps.map((step, index) => (
              <div
                key={step.id}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-background md:left-1/2 md:-translate-x-1/2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      step.status === "completed"
                        ? "bg-success"
                        : step.status === "current"
                        ? "bg-secondary animate-pulse-glow"
                        : "bg-muted"
                    }`}
                  />
                </div>
                
                {/* Timeline card */}
                <div className="ml-20 w-full animate-slide-up md:ml-0 md:w-5/12">
                  <Card className={`transition-all duration-300 ${
                    step.status === "current" ? "shadow-lg ring-2 ring-secondary" : ""
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-2 ${
                            step.status === "completed" ? "bg-success/10 text-success" :
                            step.status === "current" ? "bg-secondary/10 text-secondary" :
                            "bg-muted/50 text-muted-foreground"
                          }`}>
                            <step.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{step.title}</CardTitle>
                            {step.timestamp && (
                              <p className="text-xs text-muted-foreground">{step.timestamp}</p>
                            )}
                          </div>
                        </div>
                        {step.encrypted && (
                          <Badge variant="encrypted" className="text-xs">
                            <Lock className="mr-1 h-3 w-3" />
                            Encrypted
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        {step.status === "completed" && (
                          <Badge variant="success" className="text-xs">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Completed
                          </Badge>
                        )}
                        {step.status === "current" && (
                          <Badge variant="warning" className="text-xs">
                            <Clock className="mr-1 h-3 w-3" />
                            In Progress
                          </Badge>
                        )}
                        {step.status === "pending" && (
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
