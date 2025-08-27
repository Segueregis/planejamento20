import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ServiceOrderList from '@/components/service-order/ServiceOrderList';
import { ServiceOrder, ServiceOrderStatus } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NewServiceOrderDialog from '@/components/service-order/NewServiceOrderDialog';
import { useToast } from '@/hooks/use-toast';

// Mock data for service orders
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
    technicians: ['Ana Costa'],
    location: 'Setor D - Compressores',
    sector: 'Utilidades',
    status: ServiceOrderStatus.WAITING_MATERIAL,
    createdDate: '12/01/2024'
  }
];

const ServiceOrdersPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(mockServiceOrders);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter service orders based on search
  const filteredOrders = serviceOrders.filter(order =>
    order.osPrisma.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.technicians.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
    order.workshop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceOrderClick = (id: string) => {
    toast({
      title: "Ordem de Serviço",
      description: `Visualizando OS ${id}`
    });
  };

  const handleDeleteServiceOrder = (id: string) => {
    setServiceOrders(prev => prev.filter(order => order.id !== id));
    toast({
      title: "Ordem deletada",
      description: "A ordem de serviço foi removida com sucesso."
    });
  };

  const handleAddServiceOrder = (newServiceOrder: ServiceOrder) => {
    setServiceOrders(prev => [...prev, newServiceOrder]);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64"
      )}>
        <Navbar 
          title="Ordens de Serviço" 
          subtitle="Gestão e controle das ordens de serviço"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar ordens de serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <NewServiceOrderDialog onAddServiceOrder={handleAddServiceOrder} />
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg border p-4">
              <div className="text-2xl font-bold text-primary">{serviceOrders.length}</div>
              <p className="text-sm text-muted-foreground">Total de OS</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="text-2xl font-bold text-green-600">
                {serviceOrders.filter(os => os.status === ServiceOrderStatus.COMPLETED).length}
              </div>
              <p className="text-sm text-muted-foreground">Concluídas</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="text-2xl font-bold text-blue-600">
                {serviceOrders.filter(os => os.status === ServiceOrderStatus.IN_PROGRESS).length}
              </div>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="text-2xl font-bold text-red-600">
                {serviceOrders.filter(os => os.status === ServiceOrderStatus.PRIORITY).length}
              </div>
              <p className="text-sm text-muted-foreground">Prioridade</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {serviceOrders.filter(os => os.status === ServiceOrderStatus.WAITING_SCHEDULE).length}
              </div>
              <p className="text-sm text-muted-foreground">Aguardando</p>
            </div>
          </div>

          {/* Service Orders List */}
          <ServiceOrderList
            serviceOrders={filteredOrders}
            onServiceOrderClick={handleServiceOrderClick}
            onDeleteServiceOrder={handleDeleteServiceOrder}
          />
        </main>
      </div>
    </div>
  );
};

export default ServiceOrdersPage;