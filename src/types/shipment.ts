export interface ShipmentSubmission {
  id: string;
  shipmentId: string;
  value: string;
  category: string;
  origin: string;
  files: FileInfo[];
  walletAddress: string;
  timestamp: number;
  status: "pending" | "approved" | "rejected";
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  data: string; // base64
}
