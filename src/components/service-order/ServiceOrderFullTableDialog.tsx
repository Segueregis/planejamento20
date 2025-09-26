import React from 'react';
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Todas as Ordens de Serviço ({serviceOrders.length})</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-auto max-h-[75vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número OS</TableHead>
                <TableHead>OS Cliente</TableHead>
                <TableHead>Denominação OS</TableHead>
                <TableHead>Oficina</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Unidade Negócio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{order.osPrisma}</TableCell>
                  <TableCell>{order.osMaximo || '-'}</TableCell>
                  <TableCell className="max-w-xs truncate" title={order.description}>
                    {order.description}
                  </TableCell>
                  <TableCell>{order.workshop}</TableCell>
                  <TableCell>{order.location}</TableCell>
                  <TableCell>
                    {order.technicians.join(', ')}
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
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderFullTableDialog;