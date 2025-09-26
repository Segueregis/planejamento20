
import React, { useState, useEffect } from 'react';
import AppSidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ServiceOrderCard from '@/components/service-order/ServiceOrderCard';
import ServiceOrderFullTableDialog from '@/components/service-order/ServiceOrderFullTableDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { ServiceOrder, ServiceOrderStatus, DashboardStats } from '@/types';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';

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
  const [showAllOrdersDialog, setShowAllOrdersDialog] = useState(false);
  const { serviceOrders: realtimeOrders, loading } = useSupabaseRealtime();

  // Transform Supabase data to match ServiceOrder interface
  const serviceOrders: ServiceOrder[] = realtimeOrders.map(order => ({
    id: order.id,
    osPrisma: order.numero_os,
    osMaximo: order.numero_os_cliente || '',
    description: order.denominacao_os || order.denominacao_ativo || '',
    workshop: order.denominacao_oficina || 'Não especificado',
    technicians: order.denominacao_solicitante ? [order.denominacao_solicitante] : ['Não especificado'],
    location: order.ativo || 'Não especificado',
    sector: order.denominacao_unidade_negocio || 'Não especificado',
    status: order.status as ServiceOrderStatus || ServiceOrderStatus.WAITING_SCHEDULE,
    createdDate: new Date(order.created_at).toLocaleDateString('pt-BR'),
    scheduledDate: new Date().toLocaleDateString('pt-BR')
  }));

  // Calculate dashboard stats from real data
  const dashboardStats: DashboardStats = {
    totalServiceOrders: serviceOrders.length,
    completed: serviceOrders.filter(order => order.status === ServiceOrderStatus.COMPLETED).length,
    waitingSchedule: serviceOrders.filter(order => order.status === ServiceOrderStatus.WAITING_SCHEDULE).length,
    inProgress: serviceOrders.filter(order => order.status === ServiceOrderStatus.IN_PROGRESS).length,
    scheduled: serviceOrders.filter(order => order.status === ServiceOrderStatus.SCHEDULED).length,
    priority: serviceOrders.filter(order => order.status === ServiceOrderStatus.PRIORITY).length,
    waitingPhotoEmail: serviceOrders.filter(order => order.status === ServiceOrderStatus.WAITING_PHOTO_EMAIL).length,
    waitingMaterial: serviceOrders.filter(order => order.status === ServiceOrderStatus.WAITING_MATERIAL).length,
    totalTechnicians: 0, // TODO: Implement technicians table
    availableTechnicians: 0,
    busyTechnicians: 0,
    techniciansOnMaintenance: 0
  };
  
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
        <DashboardOverview 
          stats={dashboardStats} 
          onTotalServiceOrdersClick={() => setShowAllOrdersDialog(true)}
        />
          
          <section className="mt-8 slide-enter" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Ordens em Destaque</h2>
              <button className="text-sm text-primary hover:underline">
                Ver todas
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                <div className="col-span-full text-center p-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando ordens de serviço...</p>
                </div>
              ) : serviceOrders.length === 0 ? (
                <div className="col-span-full text-center p-8 text-muted-foreground">
                  <p>Nenhuma ordem de serviço encontrada. Importe dados do Excel para começar.</p>
                </div>
              ) : (
                serviceOrders.slice(0, 4).map((order) => (
                  <ServiceOrderCard 
                    key={order.id} 
                    serviceOrder={order} 
                    onClick={() => console.log(`Clicked on ${order.id}`)}
                  />
                ))
              )}
            </div>
          </section>
        </main>
      </div>
      
      <ServiceOrderFullTableDialog 
        open={showAllOrdersDialog}
        onOpenChange={setShowAllOrdersDialog}
        serviceOrders={serviceOrders}
      />
    </div>
  );
};

export default Index;
