import React, { useEffect } from 'react';
import SimpleServiceOrderPrintLayout from '@/components/service-order/SimpleServiceOrderPrintLayout';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

const SimplePrintPage = () => {
  const { serviceOrders: realtimeOrders, loading } = useSupabaseRealtime();
  
  useEffect(() => {
    if (!loading && realtimeOrders.length > 0) {
      // Auto-trigger print dialog after component loads
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loading, realtimeOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando dados para impressão...</p>
        </div>
      </div>
    );
  }

  return <SimpleServiceOrderPrintLayout serviceOrders={realtimeOrders} />;
};

export default SimplePrintPage;