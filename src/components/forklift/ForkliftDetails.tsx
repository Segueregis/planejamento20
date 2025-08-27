
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Forklift, ForkliftStatus } from '@/types';
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, Gauge, Info, Settings, Wrench, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForkliftDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forklift: Forklift | null;
  onEdit: () => void;
}

const ForkliftDetails = ({ open, onOpenChange, forklift, onEdit }: ForkliftDetailsProps) => {
  if (!forklift) return null;

  // Get status color classes
  const getStatusClass = (status: ForkliftStatus) => {
    switch (status) {
      case ForkliftStatus.OPERATIONAL:
        return 'bg-green-100 text-green-800 border-green-200';
      case ForkliftStatus.MAINTENANCE:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ForkliftStatus.STOPPED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{forklift.model}</span>
            <Badge variant="outline" className={cn(getStatusClass(forklift.status))}>
              {forklift.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            ID: {forklift.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Informações Gerais</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tipo</span>
                </div>
                <span className="text-sm font-medium">{forklift.type}</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Capacidade</span>
                </div>
                <span className="text-sm font-medium">{forklift.capacity}</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Horímetro</span>
                </div>
                <span className="text-sm font-medium">{forklift.hourMeter} horas</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Datas Importantes</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm">Data de Aquisição</span>
                <span className="text-sm font-medium">{forklift.acquisitionDate}</span>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-sm">Última Manutenção</span>
                <span className="text-sm font-medium">{forklift.lastMaintenance}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Manutenção</span>
              </div>
              
              <div className="p-3 bg-muted/20 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Próxima Manutenção Preventiva</span>
                  <span className="text-sm font-medium text-yellow-600">Em 8 dias</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Baseado no horímetro atual e ciclo de manutenção
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Utilização Recente</span>
          </div>
          
          <div className="h-20 bg-muted/20 rounded-md flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Dados de utilização seriam exibidos aqui</span>
          </div>
        </div>
        
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEdit}>
            Editar Empilhadeira
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForkliftDetails;
