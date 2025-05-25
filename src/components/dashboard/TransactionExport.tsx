
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Transaction } from '@/types/transaction';
import { generateTransactionHistoryPDF } from '@/utils/transactionHistoryPdfGenerator';

interface TransactionExportProps {
  transactions: Transaction[];
}

const TransactionExport: React.FC<TransactionExportProps> = ({ transactions }) => {
  const handleExport = (format: string) => {
    if (format === 'PDF') {
      generateTransactionHistoryPDF(transactions);
    } else {
      alert(`Exporting ${transactions.length} transactions as ${format}...`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download size={16} />
          <span>Export</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleExport('CSV')}>CSV</Button>
          <Button variant="ghost" size="sm" onClick={() => handleExport('PDF')}>PDF</Button>
          <Button variant="ghost" size="sm" onClick={() => handleExport('Excel')}>Excel</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TransactionExport;
