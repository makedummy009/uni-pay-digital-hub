
import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import AccountOverview from '@/components/dashboard/AccountOverview';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import TransactionDetails from '@/components/dashboard/TransactionDetails';
import { Transaction } from '@/components/dashboard/TransactionHistory';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CreditCard, ShoppingBag, MessageSquare, PieChart } from 'lucide-react';

const Dashboard = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <TooltipProvider>
        <div className="container py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard 
              title="Monthly Payments"
              value="$2,456.89"
              change={{
                value: "$245.12",
                percentage: "12%",
                positive: true
              }}
              icon={<CreditCard size={20} />}
            />
            
            <StatsCard 
              title="Shopping Spend"
              value="$840.50"
              change={{
                value: "$52.32",
                percentage: "6%",
                positive: false
              }}
              icon={<ShoppingBag size={20} />}
            />
            
            <StatsCard 
              title="New Messages"
              value="24"
              icon={<MessageSquare size={20} />}
            />
            
            <StatsCard 
              title="Analytics Views"
              value="856"
              change={{
                value: "124",
                percentage: "17%",
                positive: true
              }}
              icon={<PieChart size={20} />}
            />
          </div>
          
          {/* Account Overview Section */}
          <AccountOverview />
          
          {/* Transaction History Section */}
          <TransactionHistory onViewDetails={handleViewTransaction} />
          
          {/* Analytics Card Section */}
          <div className="mb-8">
            <AnalyticsCard />
          </div>
          
          {/* Transaction Details Modal */}
          <TransactionDetails 
            transaction={selectedTransaction}
            open={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
          />
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Dashboard;
