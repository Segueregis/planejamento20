import React, { useState, useMemo } from 'react';
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
import { ServiceOrder, ServiceOrderStatus } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
        
        {/* Table Container with both horizontal and vertical scroll */}
        <div className="flex-1 overflow-auto border rounded-md">
          <div className="min-w-full">
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
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
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhuma ordem de serviço encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderFullTableDialog;