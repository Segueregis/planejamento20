import React from 'react';
import { cn } from '@/lib/utils';
import { ServiceOrder, ServiceOrderStatus } from '@/types';
import { Trash2 } from 'lucide-react';

interface ServiceOrderListProps {
  serviceOrders: ServiceOrder[];
  onServiceOrderClick: (id: string) => void;
  onDeleteServiceOrder?: (id: string) => void;
}

const ServiceOrderList: React.FC<ServiceOrderListProps> = ({ 
  serviceOrders, 
  onServiceOrderClick,
  onDeleteServiceOrder 
}) => {
  // Get status color classes
  const getStatusColor = (status: ServiceOrderStatus) => {
    switch (status) {
      case ServiceOrderStatus.COMPLETED:
        return 'bg-status-operational text-status-operational';
      case ServiceOrderStatus.IN_PROGRESS:
        return 'bg-status-operational text-status-operational';
      case ServiceOrderStatus.PRIORITY:
        return 'bg-status-danger text-status-danger';
      case ServiceOrderStatus.WAITING_SCHEDULE:
        return 'bg-status-warning text-status-warning';
      case ServiceOrderStatus.SCHEDULED:
        return 'bg-status-info text-status-info';
      case ServiceOrderStatus.WAITING_MATERIAL:
        return 'bg-status-warning text-status-warning';
      case ServiceOrderStatus.WAITING_PHOTO_EMAIL:
        return 'bg-status-neutral text-status-neutral';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Handle delete button click
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering row click
    if (onDeleteServiceOrder) {
      onDeleteServiceOrder(id);
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">OS Prisma</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">OS Máximo</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Oficina</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Técnico(s)</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Local</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {serviceOrders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onServiceOrderClick(order.id)}
              >
                <td className="py-4 px-4 text-sm font-medium">{order.osPrisma}</td>
                <td className="py-4 px-4 text-sm">{order.osMaximo}</td>
                <td className="py-4 px-4">
                  <div className="text-sm truncate max-w-xs">{order.description}</div>
                </td>
                <td className="py-4 px-4 text-sm">{order.workshop}</td>
                <td className="py-4 px-4 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {order.technicians.map((technician, index) => (
                      <span key={index} className="bg-muted px-2 py-1 rounded text-xs">
                        {technician}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm">{order.location}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className={cn(
                      "h-2 w-2 rounded-full mr-2",
                      getStatusColor(order.status)
                    )} />
                    <span className="text-sm">{order.status}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  {onDeleteServiceOrder && (
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => handleDelete(e, order.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {serviceOrders.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          Nenhuma ordem de serviço encontrada
        </div>
      )}
    </div>
  );
};

export default ServiceOrderList;