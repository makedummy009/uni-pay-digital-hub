
export interface Transaction {
  id: string;
  date: string;
  time: string;
  description: string;
  merchant: string;
  amount: number;
  type: string;
  category: string;
  status: string;
  reference: string;
  location?: string;
  scheduledDate?: string;
  notes?: string;
}
