
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import AppSidebar from '@/components/layout/Sidebar';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ServiceOrderCard from '@/components/service-order/ServiceOrderCard';
import { ServiceOrder, ServiceOrderStatus } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Mock data for the dashboard
const mockServiceOrders: ServiceOrder[] = [
  {
    id: 'OS001',
    osPrisma: 'PRS-2024-001',
    osMaximo: 'MAX-45678',
    description: 'Manutenção preventiva do sistema hidráulico',
    workshop: 'Oficina Mecânica',
    technicians: ['João Silva'],
    location: 'Setor A - Linha 1',
    sector: 'Produção',
    status: ServiceOrderStatus.IN_PROGRESS,
    createdDate: '15/01/2024',
    scheduledDate: '16/01/2024'
  },
  {
    id: 'OS002',
    osPrisma: 'PRS-2024-002',
    osMaximo: 'MAX-45679',
    description: 'Troca de peças do motor elétrico',
    workshop: 'Oficina Elétrica',
    technicians: ['Maria Santos'],
    location: 'Setor B - Linha 2',
    sector: 'Montagem',
    status: ServiceOrderStatus.PRIORITY,
    createdDate: '14/01/2024'
  },
  {
    id: 'OS003',
    osPrisma: 'PRS-2024-003',
    osMaximo: 'MAX-45680',
    description: 'Calibração de sensores',
    workshop: 'Oficina Instrumentação',
    technicians: ['Carlos Oliveira'],
    location: 'Setor C - Sala de Controle',
    sector: 'Instrumentação',
    status: ServiceOrderStatus.WAITING_SCHEDULE,
    createdDate: '13/01/2024'
  },
  {
    id: 'OS004',
    osPrisma: 'PRS-2024-004',
    osMaximo: 'MAX-45681',
    description: 'Reparo do sistema de refrigeração',
    workshop: 'Oficina Mecânica',
    technicians: ['Ana Costa', 'Pedro Lima'],
    location: 'Setor D - Compressores',
    sector: 'Utilidades',
    status: ServiceOrderStatus.WAITING_MATERIAL,
    createdDate: '12/01/2024'
  }
];

const Index = () => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState<string>('');
  
  useEffect(() => {
    // Set current date in Brazilian format
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(now.toLocaleDateString('pt-BR', options));
    
    // First letter uppercase
    setCurrentDate(prev => 
      prev.charAt(0).toUpperCase() + prev.slice(1)
    );
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col pt-12">
        <Navbar 
          title="Painel" 
          subtitle={currentDate}
        />
        
        <main className="flex-1 px-6 py-6">
          <DashboardOverview />
          
          <section className="mt-8 slide-enter" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Ordens em Destaque</h2>
              <button className="text-sm text-primary hover:underline">
                Ver todas
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockServiceOrders.map((order) => (
                <ServiceOrderCard 
                  key={order.id} 
                  serviceOrder={order} 
                  onClick={() => console.log(`Clicked on ${order.id}`)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
