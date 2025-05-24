import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Calendar, Download, Search, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { useNavigate } from 'react-router-dom';

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
}

interface TransactionHistoryProps {
  onViewDetails: (transaction: Transaction) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onViewDetails }) => {
  const { transactions } = useTransactions();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7days');
  const [transactionType, setTransactionType] = useState('all');
  const [amountRange, setAmountRange] = useState([0, 5000]);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  
  // Apply filters function
  const applyFilters = () => {
    let results = [...transactions];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(tx => 
        tx.description.toLowerCase().includes(query) || 
        tx.merchant.toLowerCase().includes(query)
      );
    }
    
    // Apply transaction type filter
    if (transactionType !== 'all') {
      results = results.filter(tx => tx.type.toLowerCase() === transactionType.toLowerCase());
    }
    
    // Apply amount range filter
    results = results.filter(tx => {
      const amount = Math.abs(tx.amount);
      return amount >= amountRange[0] && amount <= amountRange[1];
    });
    
    // Apply date range filter
    const today = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7days':
        startDate.setDate(today.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(today.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        // For 'all', no date filtering
        setFilteredTransactions(results);
        return;
    }
    
    results = results.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= today;
    });
    
    setFilteredTransactions(results);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setDateRange('7days');
    setTransactionType('all');
    setAmountRange([0, 5000]);
    setFilteredTransactions(transactions);
  };

  // Handle export
  const handleExport = (format: string) => {
    alert(`Exporting ${filteredTransactions.length} transactions as ${format}...`);
  };
  
  return (
    <Card className="mb-8">
      <CardContent className="p-0">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold">Transaction History</h2>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => {
                  navigate('/transactions');
                }} 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 transition-all duration-200 hover:bg-blue-50 hover:border-blue-300"
              >
                Go to Transactions
              </Button>
              
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
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search transactions..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Date Range Filter */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Transaction Type Filter */}
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="purchase">Purchases</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="subscription">Subscriptions</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Filter Action Buttons */}
            <div className="flex gap-2">
              <Button variant="default" className="flex-1" onClick={applyFilters}>
                <Filter size={16} className="mr-1" /> Apply Filters
              </Button>
              <Button variant="outline" onClick={resetFilters}>Reset</Button>
            </div>
            
            {/* Amount Range Slider */}
            <div className="col-span-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Amount Range:</span>
                <span className="text-sm font-medium">
                  ${amountRange[0].toLocaleString()} - ${amountRange[1].toLocaleString()}
                </span>
              </div>
              <Slider
                value={amountRange}
                min={0}
                max={5000}
                step={100}
                onValueChange={setAmountRange}
                className="mt-2"
              />
            </div>
          </div>
        </div>
        
        {/* Transaction Table */}
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
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
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
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {filteredTransactions.length} of {transactions.length} transactions</p>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
