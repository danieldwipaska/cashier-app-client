import React from 'react';
import Layout from './Layout/Layout';
import Header from '../../components/Backoffices/Header';
import TotalPaymentCard from 'components/Backoffices/Dashboard/TotalPaymentCard';
import TopupCard from 'components/Backoffices/Dashboard/TopupCard';
import CheckoutCard from 'components/Backoffices/Dashboard/CheckoutCard';
import TotalTransactionCard from 'components/Backoffices/Dashboard/TotalTransactionCard';
import EmployeeAwards from 'components/Backoffices/Dashboard/EmployeeAwards';
import WeeklyEmployeeAwards from 'components/Backoffices/Dashboard/WeeklyEmployeeAwards';
import RecentReportTable from 'components/Backoffices/Dashboard/RecentReportTable';
import DailyPurchaseLineChart from 'components/Backoffices/Dashboard/Charts/DailyPurchaseLineChart';
import { useCheckToken } from 'hooks/useCheckToken';
import { useAuth } from 'context/AuthContext';

const Backoffices = () => {
  const { user } = useAuth();

  useCheckToken(user);

  return (
    <Layout>
      <Header title="BACKOFFICES" />
      <div className="flex flex-col gap-2">
        <div className='flex justify-between items-center w-full bg-gray-200'>
          <TotalPaymentCard />
          <div className='flex items-center gap-10'>
            <TopupCard />
            <CheckoutCard />
            <TotalTransactionCard />
          </div>
        </div>
        <div className='grid grid-cols-6 gap-2'>
          <div className='col-span-4'>
            <div className='mb-4'>
              <DailyPurchaseLineChart />
            </div>
            <h3 className='font-medium'>Recent Transactions</h3>
            <div className='overflow-y-auto mb-5 max-h-[calc(100vh-450px)]'>
              <RecentReportTable />
            </div>
          </div>
          <div className='col-span-2 flex flex-col gap-3'>
            <EmployeeAwards />
            <WeeklyEmployeeAwards />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Backoffices;
