
import React from 'react';
import { cn } from '@/lib/utils';
import { Forklift, ForkliftStatus } from '@/types';
import { Trash2 } from 'lucide-react';

interface ForkliftListProps {
  forklifts: Forklift[];
  onForkliftClick: (id: string) => void;
  onDeleteForklift?: (id: string) => void;
}

const ForkliftList: React.FC<ForkliftListProps> = ({ 
  forklifts, 
  onForkliftClick,
  onDeleteForklift 
}) => {
  // Get status color classes
  const getStatusColor = (status: ForkliftStatus) => {
    switch (status) {
      case ForkliftStatus.OPERATIONAL:
        return 'bg-status-operational text-status-operational';
      case ForkliftStatus.MAINTENANCE:
        return 'bg-status-maintenance text-status-maintenance';
      case ForkliftStatus.STOPPED:
        return 'bg-status-warning text-status-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Get type color classes
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Gás':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Elétrica':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Retrátil':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle delete button click
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering row click
    if (onDeleteForklift) {
      onDeleteForklift(id);
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Modelo</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tipo</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Capacidade</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Horímetro</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Última Manutenção</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {forklifts.map((forklift) => (
              <tr 
                key={forklift.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onForkliftClick(forklift.id)}
              >
                <td className="py-4 px-4 text-sm">{forklift.id}</td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium">{forklift.model}</div>
                </td>
                <td className="py-4 px-4">
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full border",
                    getTypeColor(forklift.type)
                  )}>
                    {forklift.type}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm">{forklift.capacity}</td>
                <td className="py-4 px-4 text-sm">{forklift.hourMeter}</td>
                <td className="py-4 px-4 text-sm">{forklift.lastMaintenance}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className={cn(
                      "h-2 w-2 rounded-full mr-2",
                      getStatusColor(forklift.status)
                    )} />
                    <span className="text-sm">{forklift.status}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  {onDeleteForklift && (
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => handleDelete(e, forklift.id)}
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
      
      {forklifts.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          Nenhuma empilhadeira encontrada
        </div>
      )}
    </div>
  );
};

export default ForkliftList;
