
import React from 'react';
import { Forklift, ForkliftStatus } from '@/types';
import { cn } from '@/lib/utils';
import Badge from '@/components/common/Badge';
import { Clock, Settings, Calendar } from 'lucide-react';

interface ForkliftCardProps {
  forklift: Forklift;
  onClick?: () => void;
}

const ForkliftCard: React.FC<ForkliftCardProps> = ({ forklift, onClick }) => {
  // Determine the status variant for the badge
  const getStatusVariant = (status: ForkliftStatus) => {
    switch (status) {
      case ForkliftStatus.OPERATIONAL:
        return 'success';
      case ForkliftStatus.MAINTENANCE:
        return 'warning';
      case ForkliftStatus.STOPPED:
        return 'outline';
      default:
        return 'default';
    }
  };

  // Format the hour meter to include leading zeros
  const formattedHourMeter = forklift.hourMeter.toString().padStart(5, '0');

  return (
    <div 
      className="glass-card glass-card-hover rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:translate-y-[-2px]"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">{forklift.id}</h3>
          <p className="text-muted-foreground text-sm">{forklift.model}</p>
        </div>
        <Badge variant={getStatusVariant(forklift.status)} withDot={forklift.status === ForkliftStatus.OPERATIONAL}>
          {forklift.status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-2">Tipo:</span>
          <span>{forklift.type}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-2">Horímetro:</span>
          <span className="font-semibold bg-muted/40 px-2 py-0.5 rounded">
            {formattedHourMeter}
          </span>
        </div>
        
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-2">Última manutenção:</span>
          <span>{forklift.lastMaintenance}</span>
        </div>
      </div>
      
      {/* Capacity indicator at the bottom */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Capacidade</span>
          <span className="font-medium">{forklift.capacity}</span>
        </div>
      </div>
    </div>
  );
};

export default ForkliftCard;
