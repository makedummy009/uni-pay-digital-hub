
import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';

// Mock initial transactions
const initialTransactions: Transaction[] = [
  {
    id: 'tx-001',
    date: '2023-05-19',
    time: '14:30:25',
    description: 'Monthly Subscription',
    merchant: 'Netflix',
    amount: -14.99,
    type: 'Subscription',
    category: 'Entertainment',
    status: 'Completed',
    reference: 'REF123456789',
    location: 'Online'
  },
  {
    id: 'tx-002',
    date: '2023-05-18',
    time: '09:45:12',
    description: 'Transfer to John Smith',
    merchant: 'John Smith',
    amount: -150.00,
    type: 'Transfer',
    category: 'Personal',
    status: 'Completed',
    reference: 'REF987654321',
  },
  {
    id: 'tx-003',
    date: '2023-05-17',
    time: '16:22:08',
    description: 'Online Store Purchase',
    merchant: 'Amazon',
    amount: -85.25,
    type: 'Purchase',
    category: 'Shopping',
    status: 'Completed',
    reference: 'REF567891234',
    location: 'Online'
  },
  {
    id: 'tx-004',
    date: '2023-05-16',
    time: '08:01:45',
    description: 'Salary Deposit',
    merchant: 'ABC Corp',
    amount: 3500.00,
    type: 'Income',
    category: 'Salary',
    status: 'Completed',
    reference: 'REF432156789',
  }
];

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const stored = localStorage.getItem('unipay_transactions');
    return stored ? JSON.parse(stored) : initialTransactions;
  });

  useEffect(() => {
    localStorage.setItem('unipay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
