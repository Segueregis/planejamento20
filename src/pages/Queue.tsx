import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import AppSidebar from '@/components/layout/Sidebar';
import ServiceOrderList from '@/components/service-order/ServiceOrderList';
import { ServiceOrder, ServiceOrderStatus } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock data for service orders waiting to be scheduled or coming up
const waitingOrders: ServiceOrder[] = [
  {
    id: 'OS005',
    osPrisma: 'PRS-2024-005',
    osMaximo: 'MAX-45682',
    description: 'Inspeção do sistema de segurança',
    workshop: 'Oficina Segurança',
    technicians: ['Roberto Silva'],
    location: 'Setor E - Portaria',
    sector: 'Segurança',
    status: ServiceOrderStatus.WAITING_SCHEDULE,
    createdDate: '10/01/2024'
  },
  {
    id: 'OS006',
    osPrisma: 'PRS-2024-006',
    osMaximo: 'MAX-45683',
    description: 'Manutenção do sistema de ar condicionado',
    workshop: 'Oficina Refrigeração',
    technicians: ['Luis Santos'],
    location: 'Setor F - Escritório',
    sector: 'Predial',
    status: ServiceOrderStatus.WAITING_SCHEDULE,
    createdDate: '09/01/2024'
  },
  {
    id: 'OS007',
    osPrisma: 'PRS-2024-007',
    osMaximo: 'MAX-45684',
    description: 'Reparo de equipamento de laboratório',
    workshop: 'Oficina Especializada',
    technicians: ['Ana Costa', 'Pedro Lima'],
    location: 'Setor G - Laboratório',
    sector: 'Qualidade',
    status: ServiceOrderStatus.WAITING_SCHEDULE,
    createdDate: '08/01/2024'
  },
  {
    id: 'OS008',
    osPrisma: 'PRS-2024-008',
    osMaximo: 'MAX-45685',
    description: 'Verificação do sistema de combate a incêndio',
    workshop: 'Oficina Segurança',
    technicians: ['Carlos Oliveira'],
    location: 'Setor H - Industrial',
    sector: 'Segurança',
    status: ServiceOrderStatus.PRIORITY,
    createdDate: '07/01/2024',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR') // Tomorrow
  },
  {
    id: 'OS009',
    osPrisma: 'PRS-2024-009',
    osMaximo: 'MAX-45686',
    description: 'Manutenção preventiva de motor',
    workshop: 'Oficina Mecânica',
    technicians: ['Maria Santos'],
    location: 'Setor I - Produção',
    sector: 'Produção',
    status: ServiceOrderStatus.SCHEDULED,
    createdDate: '06/01/2024',
    scheduledDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toLocaleDateString('pt-BR') // 3 days from now
  }
];

const QueuePage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [queueOrders, setQueueOrders] = useState<ServiceOrder[]>(waitingOrders);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter service orders based on search
  const filteredOrders = queueOrders.filter(order =>
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
    setQueueOrders(prev => prev.filter(order => order.id !== id));
    toast({
      title: "Ordem removida da fila",
      description: "A ordem de serviço foi removida da fila de programação."
    });
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col pt-12">
        <Navbar 
          title="Fila de Programação" 
          subtitle="Próximas ordens de serviço a serem programadas"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar na fila de programação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-lg border p-4">
              <div className="text-2xl font-bold text-primary">{queueOrders.length}</div>
              <p className="text-sm text-muted-foreground">OS na Fila</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="text-2xl font-bold text-orange-600">
                {queueOrders.filter(os => os.status === ServiceOrderStatus.WAITING_SCHEDULE).length}
              </div>
              <p className="text-sm text-muted-foreground">Aguardando Programação</p>
            </div>
            <div className="bg-card rounded-lg border p-4">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(queueOrders.flatMap(os => os.technicians)).size}
              </div>
              <p className="text-sm text-muted-foreground">Técnicos Envolvidos</p>
            </div>
          </div>

          {/* Queue List */}
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

export default QueuePage;