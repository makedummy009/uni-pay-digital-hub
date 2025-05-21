
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import TransactionList from '@/components/dashboard/TransactionList';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import { CreditCard, ShoppingBag, MessageSquare, PieChart } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TransactionList />
          </div>
          
          <div>
            <AnalyticsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
