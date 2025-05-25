
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetails: (transaction: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onViewDetails
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onViewDetails(transaction)}>
                <TableCell className="font-medium whitespace-nowrap">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div>{transaction.description}</div>
                  <div className="text-sm text-gray-500">{transaction.merchant}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-50">{transaction.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                      transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                      'bg-red-100 text-red-800 hover:bg-red-100'
                    }`}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {transaction.amount > 0 ? (
                      <ArrowDown className="text-green-600" size={16} />
                    ) : (
                      <ArrowUp className="text-red-600" size={16} />
                    )}
                    <span className={`${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    } font-medium`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(transaction);
                    }}
                  >
                    <span className="sr-only">View details</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No transactions found matching your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
