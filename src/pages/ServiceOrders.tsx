import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ServiceOrderList from '@/components/service-order/ServiceOrderList';
import ServiceOrderCalendar from '@/components/service-order/ServiceOrderCalendar';
import { ServiceOrder, ServiceOrderStatus } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NewServiceOrderDialog from '@/components/service-order/NewServiceOrderDialog';
import { useToast } from '@/hooks/use-toast';
import { isSameDay } from 'date-fns';

// Mock data for service orders with proper dates
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
    scheduledDate: new Date().toLocaleDateString('pt-BR') // Today
  },
  {
    id: 'OS002',
    osPrisma: 'PRS-2024-002',
    osMaximo: 'MAX-45679',
    description: 'Troca de peças do motor elétrico',
    workshop: 'Oficina Elétrica',
    technicians: ['Maria Santos', 'Pedro Lima'],
    location: 'Setor B - Linha 2',
    sector: 'Montagem',
    status: ServiceOrderStatus.PRIORITY,
    createdDate: '14/01/2024',
    scheduledDate: new Date().toLocaleDateString('pt-BR') // Today
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
    createdDate: '13/01/2024',
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR') // Tomorrow
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
    createdDate: '12/01/2024',
    scheduledDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString('pt-BR') // Day after tomorrow
  },
  {
    id: 'OS005',
    osPrisma: 'PRS-2024-005',
    osMaximo: 'MAX-45682',
    description: 'Manutenção do sistema de ventilação',
    workshop: 'Oficina Mecânica',
    technicians: ['Roberto Silva', 'Luis Santos'],
    location: 'Setor E - HVAC',
    sector: 'Utilidades',
    status: ServiceOrderStatus.SCHEDULED,
    createdDate: '11/01/2024',
    scheduledDate: new Date().toLocaleDateString('pt-BR') // Today
  }
];

const ServiceOrdersPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(mockServiceOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date()); // Default to today

  // Filter service orders based on search and selected date
  const filteredOrders = useMemo(() => {
    let filtered = serviceOrders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.osPrisma.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.technicians.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.workshop.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(order => {
        if (!order.scheduledDate) return false;
        const orderDate = new Date(order.scheduledDate.split('/').reverse().join('-'));
        return isSameDay(orderDate, selectedDate);
      });
    }

    return filtered;
  }, [serviceOrders, searchTerm, selectedDate]);

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

          {/* Calendar and Service Orders Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <ServiceOrderCalendar
                serviceOrders={serviceOrders}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            {/* Service Orders List */}
            <div className="lg:col-span-3">
              <ServiceOrderList
                serviceOrders={filteredOrders}
                onServiceOrderClick={handleServiceOrderClick}
                onDeleteServiceOrder={handleDeleteServiceOrder}
              />
              
              {filteredOrders.length === 0 && selectedDate && (
                <div className="text-center p-8 text-muted-foreground">
                  <p>Nenhuma ordem de serviço encontrada para {selectedDate.toLocaleDateString('pt-BR')}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServiceOrdersPage;