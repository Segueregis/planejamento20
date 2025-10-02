import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ServiceOrder, ServiceOrderStatus } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Status color helper function
const getStatusColor = (status: ServiceOrderStatus) => {
  switch (status) {
    case ServiceOrderStatus.COMPLETED:
      return 'bg-status-operational text-status-operational';
    case ServiceOrderStatus.IN_PROGRESS:
      return 'bg-status-operational text-status-operational';
    case ServiceOrderStatus.PRIORITY:
      return 'bg-status-danger text-status-danger';
    case ServiceOrderStatus.WAITING_SCHEDULE:
      return 'bg-status-maintenance text-status-maintenance';
    case ServiceOrderStatus.SCHEDULED:
      return 'bg-primary text-primary';
    case ServiceOrderStatus.WAITING_MATERIAL:
      return 'bg-status-warning text-status-warning';
    case ServiceOrderStatus.WAITING_PHOTO_EMAIL:
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

interface ServiceOrderFullTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceOrders: ServiceOrder[];
}

const ServiceOrderFullTableDialog: React.FC<ServiceOrderFullTableDialogProps> = ({
  open,
  onOpenChange,
  serviceOrders
}) => {
  const [numeroOSSearch, setNumeroOSSearch] = useState('');
  const [osClienteSearch, setOSClienteSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isScheduling, setIsScheduling] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Sync horizontal scrolling between table and scrollbar
  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    const scrollbar = scrollbarRef.current;
    
    if (!tableContainer || !scrollbar) return;

    const handleTableScroll = () => {
      scrollbar.scrollLeft = tableContainer.scrollLeft;
    };

    const handleScrollbarScroll = () => {
      tableContainer.scrollLeft = scrollbar.scrollLeft;
    };

    tableContainer.addEventListener('scroll', handleTableScroll);
    scrollbar.addEventListener('scroll', handleScrollbarScroll);

    return () => {
      tableContainer.removeEventListener('scroll', handleTableScroll);
      scrollbar.removeEventListener('scroll', handleScrollbarScroll);
    };
  }, []);

  // Filter service orders based on search terms
  const filteredOrders = useMemo(() => {
    let filtered = serviceOrders;

    if (numeroOSSearch) {
      filtered = filtered.filter(order =>
        order.osPrisma.toLowerCase().includes(numeroOSSearch.toLowerCase())
      );
    }

    if (osClienteSearch) {
      filtered = filtered.filter(order =>
        order.osMaximo?.toLowerCase().includes(osClienteSearch.toLowerCase())
      );
    }

    return filtered;
  }, [serviceOrders, numeroOSSearch, osClienteSearch]);

  const handleScheduleOrder = async () => {
    if (!selectedOrder || !selectedDate) return;

    setIsScheduling(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar autenticado",
          variant: "destructive",
        });
        return;
      }

      // Format the scheduled date
      const formattedDate = format(selectedDate, 'dd/MM/yyyy', { locale: ptBR });

      const { error } = await supabase
        .from('ordens_servico')
        .insert({
          numero_os: selectedOrder.osPrisma,
          os_cliente: selectedOrder.osMaximo || '',
          denominacao_os: selectedOrder.description || '',
          denominacao_oficina: selectedOrder.workshop || '',
          denominacao_ativo: selectedOrder.sector || '',
          status: 'Programado',
          created_by: user.id,
          observacoes_servico: `Data programada: ${formattedDate}`
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Sucesso",
        description: "OS incluída na programação",
      });

      setSelectedOrder(null);
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error scheduling order:', error);
      toast({
        title: "Erro",
        description: "Falha ao incluir OS na programação",
        variant: "destructive",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Todas as Ordens de Serviço ({filteredOrders.length})</DialogTitle>
        </DialogHeader>
        
        {/* Search Filters */}
        <div className="flex gap-4 mb-4 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por Número OS..."
              value={numeroOSSearch}
              onChange={(e) => setNumeroOSSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por OS Cliente..."
              value={osClienteSearch}
              onChange={(e) => setOSClienteSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Table Container with vertical scroll only */}
        <div 
          ref={tableContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden border rounded-md"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="min-w-[140px]">Número OS</TableHead>
                  <TableHead className="min-w-[140px]">OS Cliente</TableHead>
                  <TableHead className="min-w-[250px]">Denominação OS</TableHead>
                  <TableHead className="min-w-[180px]">Oficina</TableHead>
                  <TableHead className="min-w-[200px]">Ativo</TableHead>
                  <TableHead className="min-w-[200px]">Solicitante</TableHead>
                  <TableHead className="min-w-[180px]">Unidade Negócio</TableHead>
                  <TableHead className="min-w-[140px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Data Criação</TableHead>
                  <TableHead className="min-w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{order.osPrisma}</TableCell>
                    <TableCell>{order.osMaximo || '-'}</TableCell>
                    <TableCell className="max-w-[250px]" title={order.description}>
                      <div className="truncate">{order.description}</div>
                    </TableCell>
                    <TableCell>{order.workshop}</TableCell>
                    <TableCell title={order.location}>
                      <div className="truncate">{order.location}</div>
                    </TableCell>
                    <TableCell title={order.technicians.join(', ')}>
                      <div className="truncate">{order.technicians.join(', ')}</div>
                    </TableCell>
                    <TableCell>{order.sector}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.createdDate}</TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Programar
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                            locale={ptBR}
                          />
                          <div className="p-3 border-t">
                            <Button 
                              onClick={handleScheduleOrder}
                              disabled={!selectedDate || isScheduling}
                              className="w-full"
                            >
                              {isScheduling ? "Incluindo..." : "Incluir na Programação"}
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Nenhuma ordem de serviço encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Floating horizontal scrollbar */}
        <div 
          ref={scrollbarRef}
          className="overflow-x-auto overflow-y-hidden border-t bg-background"
          style={{ height: '20px' }}
        >
          <div style={{ width: '1600px', height: '1px' }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderFullTableDialog;