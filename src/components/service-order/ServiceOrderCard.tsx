import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceOrder, ServiceOrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Calendar, MapPin, User, Wrench,
  Clock, AlertTriangle, CheckCircle
} from 'lucide-react';

interface ServiceOrderCardProps {
  serviceOrder: ServiceOrder;
  onClick: () => void;
}

const ServiceOrderCard: React.FC<ServiceOrderCardProps> = ({ 
  serviceOrder, 
  onClick 
}) => {
  // Get status color classes
  const getStatusColor = (status: ServiceOrderStatus) => {
    switch (status) {
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

  const getStatusIcon = (status: ServiceOrderStatus) => {
    switch (status) {
      case ServiceOrderStatus.IN_PROGRESS:
        return CheckCircle;
      case ServiceOrderStatus.PRIORITY:
        return AlertTriangle;
      case ServiceOrderStatus.WAITING_SCHEDULE:
        return Clock;
      case ServiceOrderStatus.SCHEDULED:
        return Calendar;
      default:
        return Clock;
    }
  };

  const StatusIcon = getStatusIcon(serviceOrder.status);

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-sm">{serviceOrder.osPrisma}</h3>
            <p className="text-xs text-muted-foreground">{serviceOrder.osMaximo}</p>
          </div>
          <div className="flex items-center gap-1">
            <div className={cn(
              "h-2 w-2 rounded-full",
              getStatusColor(serviceOrder.status)
            )} />
            <StatusIcon className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Wrench className="w-3 h-3" />
            <span className="truncate">{serviceOrder.description}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="w-3 h-3" />
            <span>{serviceOrder.technician}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>{serviceOrder.location}</span>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <Badge 
            variant="secondary" 
            className="text-xs px-2 py-0.5"
          >
            {serviceOrder.workshop}
          </Badge>
          
          <Badge 
            variant={serviceOrder.status === ServiceOrderStatus.PRIORITY ? "destructive" : "default"}
            className="text-xs px-2 py-0.5"
          >
            {serviceOrder.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceOrderCard;