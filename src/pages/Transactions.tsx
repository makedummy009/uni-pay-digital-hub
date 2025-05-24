
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Download, Calendar, Smartphone, CreditCard, Building2, Clock } from 'lucide-react';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { ScheduleTransactionModal } from '@/components/transactions/ScheduleTransactionModal';
import { PaymentMethodModal } from '@/components/transactions/PaymentMethodModal';
import { useTransactions } from '@/hooks/useTransactions';
import { generateTransactionPDF } from '@/utils/pdfGenerator';
import { Transaction } from '@/types/transaction';

const Transactions = () => {
  const navigate = useNavigate();
  const { transactions, addTransaction, updateTransaction } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filterTransactions = (type: string) => {
    if (type === 'all') return transactions;
    if (type === 'scheduled') return transactions.filter(t => t.status === 'Scheduled');
    if (type === 'completed') return transactions.filter(t => t.status === 'Completed');
    if (type === 'pending') return transactions.filter(t => t.status === 'Pending');
    return transactions.filter(t => t.type.toLowerCase() === type.toLowerCase());
  };

  const handleDownloadPDF = (transaction: Transaction) => {
    generateTransactionPDF(transaction);
  };

  const handleSimulateTransaction = () => {
    const mockTransactions = [
      {
        merchant: 'Amazon India',
        amount: -1299.99,
        type: 'Purchase',
        category: 'Shopping',
        description: 'Online Shopping - Electronics'
      },
      {
        merchant: 'Starbucks',
        amount: -450.00,
        type: 'Payment',
        category: 'Food & Dining',
        description: 'Coffee Purchase'
      },
      {
        merchant: 'Salary Credit',
        amount: 75000.00,
        type: 'Income',
        category: 'Salary',
        description: 'Monthly Salary Deposit'
      }
    ];

    const randomTransaction = mockTransactions[Math.floor(Math.random() * mockTransactions.length)];
    
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      merchant: randomTransaction.merchant,
      amount: randomTransaction.amount,
      type: randomTransaction.type,
      category: randomTransaction.category,
      description: randomTransaction.description,
      status: 'Completed',
      reference: `REF${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      location: 'Online'
    };

    addTransaction(newTransaction);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Transactions</h1>
              <p className="text-gray-600">Manage your payments and transfers</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(true)}>
              <Smartphone size={16} className="mr-2" />
              Quick Pay
            </Button>
            <Button variant="outline" onClick={() => setIsScheduleModalOpen(true)}>
              <Clock size={16} className="mr-2" />
              Schedule
            </Button>
            <Button onClick={handleSimulateTransaction}>
              <Plus size={16} className="mr-2" />
              Simulate Transaction
            </Button>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="container py-2">
          <div className="flex items-center justify-center gap-2 text-green-800 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>🔒 All data is encrypted and follows RBI compliance guidelines</span>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {transactions.filter(t => t.status === 'Pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue Simulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₹10,000</div>
              <p className="text-xs text-gray-500">Cross-sell revenue (Demo)</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="payment">Payments</TabsTrigger>
                <TabsTrigger value="transfer">Transfers</TabsTrigger>
              </TabsList>
              
              {['all', 'completed', 'pending', 'scheduled', 'payment', 'transfer'].map(tab => (
                <TabsContent key={tab} value={tab} className="mt-4">
                  <div className="space-y-4">
                    {filterTransactions(tab).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>No transactions found</p>
                      </div>
                    ) : (
                      filterTransactions(tab).map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsTransactionModalOpen(true);
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              {transaction.type === 'Transfer' && <Building2 size={20} className="text-purple-600" />}
                              {transaction.type === 'Payment' && <CreditCard size={20} className="text-purple-600" />}
                              {transaction.type === 'Purchase' && <Smartphone size={20} className="text-purple-600" />}
                              {!['Transfer', 'Payment', 'Purchase'].includes(transaction.type) && <Calendar size={20} className="text-purple-600" />}
                            </div>
                            
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              <div className="text-sm text-gray-500">{transaction.merchant}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(`${transaction.date}T${transaction.time}`).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.amount >= 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                            </div>
                            <Badge
                              variant={
                                transaction.status === 'Completed' ? 'default' :
                                transaction.status === 'Pending' ? 'secondary' : 'outline'
                              }
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadPDF(transaction);
                              }}
                            >
                              <Download size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <TransactionModal
        transaction={selectedTransaction}
        open={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onDownloadPDF={handleDownloadPDF}
      />
      
      <ScheduleTransactionModal
        open={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={addTransaction}
      />
      
      <PaymentMethodModal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onTransaction={addTransaction}
      />
    </div>
  );
};

export default Transactions;
