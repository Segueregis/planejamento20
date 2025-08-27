
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
import { User } from '@/types';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { BadgeCheck, Calendar, CalendarDays, Clock, FileText, Phone, User as UserIcon } from 'lucide-react';

interface OperatorDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operator: User | null;
  onEdit: () => void;
}

const OperatorDetails = ({ open, onOpenChange, operator, onEdit }: OperatorDetailsProps) => {
  if (!operator) return null;

  // Get status color classes
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Regular':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Próximo do Vencimento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Vencido':
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
            <span className="text-xl">{operator.name}</span>
            <Badge variant="outline">{operator.role}</Badge>
          </DialogTitle>
          <DialogDescription>
            ID: {operator.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Informações Pessoais</span>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">CPF:</span>
                <span className="ml-2">{operator.cpf}</span>
              </div>
              
              <div className="text-sm flex items-center">
                <span className="text-muted-foreground">Contato:</span>
                <span className="ml-2 flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  {operator.contact}
                </span>
              </div>
              
              <div className="text-sm">
                <span className="text-muted-foreground">Turno:</span>
                <span className="ml-2">
                  <Badge variant="secondary" className="font-normal">{operator.shift}</Badge>
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Registro</span>
            </div>
            
            <div className="text-sm">
              <span className="text-muted-foreground">Data de Registro:</span>
              <span className="ml-2">{operator.registrationDate}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Certificações</span>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-md border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">ASO</span>
                  <Badge className={cn("font-normal", getStatusClass(operator.asoStatus))}>
                    <BadgeCheck className="mr-1 h-3 w-3" />
                    {operator.asoStatus}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Validade: {operator.asoExpirationDate}</span>
                </div>
              </div>
              
              <div className="p-3 rounded-md border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">NR-11</span>
                  <Badge className={cn("font-normal", getStatusClass(operator.nrStatus))}>
                    <BadgeCheck className="mr-1 h-3 w-3" />
                    {operator.nrStatus}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Validade: {operator.nrExpirationDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEdit}>
            Editar Operador
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OperatorDetails;
