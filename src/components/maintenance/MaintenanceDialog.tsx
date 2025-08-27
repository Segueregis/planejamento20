
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Maintenance, MaintenanceStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface MaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance?: Maintenance;
  onSave: (maintenance: Maintenance) => void;
  availableForklifts: { id: string; model: string }[];
  availableOperators: { id: string; name: string }[];
}

const MaintenanceDialog = ({ 
  open, 
  onOpenChange, 
  maintenance, 
  onSave,
  availableForklifts,
  availableOperators 
}: MaintenanceDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!maintenance;
  
  const defaultCompletedDate = maintenance?.completedDate || '';
  
  const [formData, setFormData] = useState<Partial<Maintenance>>(
    maintenance || {
      id: `M${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      forkliftId: '',
      forkliftModel: '',
      issue: '',
      reportedBy: '',
      reportedDate: format(new Date(), 'yyyy-MM-dd'),
      status: MaintenanceStatus.WAITING,
      completedDate: ''
    }
  );

  // Handle forklift selection
  const handleForkliftChange = (forkliftId: string) => {
    const selectedForklift = availableForklifts.find(f => f.id === forkliftId);
    setFormData(prev => ({ 
      ...prev, 
      forkliftId,
      forkliftModel: selectedForklift?.model || ''
    }));
  };

  // Handle reporter selection
  const handleReporterChange = (reporter: string) => {
    setFormData(prev => ({ ...prev, reportedBy: reporter }));
  };

  // Handle form field changes
  const handleChange = (field: keyof Maintenance, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If changing status to completed, set completed date to today
    if (field === 'status' && value === MaintenanceStatus.COMPLETED) {
      setFormData(prev => ({ 
        ...prev, 
        completedDate: format(new Date(), 'yyyy-MM-dd')
      }));
    }
    // If changing status from completed, clear completed date
    else if (field === 'status' && value !== MaintenanceStatus.COMPLETED && formData.completedDate) {
      setFormData(prev => ({ ...prev, completedDate: '' }));
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Parse date string to Date object
  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return undefined;
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.forkliftId || !formData.issue || !formData.reportedBy || !formData.reportedDate) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Save maintenance
    onSave(formData as Maintenance);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `M${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        forkliftId: '',
        forkliftModel: '',
        issue: '',
        reportedBy: '',
        reportedDate: format(new Date(), 'yyyy-MM-dd'),
        status: MaintenanceStatus.WAITING,
        completedDate: ''
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Manutenção atualizada" : "Manutenção registrada",
      description: `Manutenção ${isEditing ? 'atualizada' : 'registrada'} com sucesso!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Manutenção' : 'Registrar Nova Manutenção'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações da manutenção nos campos abaixo.' 
              : 'Preencha as informações da nova manutenção nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="forkliftId">Empilhadeira</Label>
                <Select 
                  value={formData.forkliftId} 
                  onValueChange={handleForkliftChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empilhadeira" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableForklifts.map(forklift => (
                      <SelectItem key={forklift.id} value={forklift.id}>
                        {forklift.model} ({forklift.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MaintenanceStatus.WAITING}>Aguardando</SelectItem>
                    <SelectItem value={MaintenanceStatus.IN_PROGRESS}>Em andamento</SelectItem>
                    <SelectItem value={MaintenanceStatus.COMPLETED}>Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issue">Descrição do Problema</Label>
              <Textarea 
                id="issue" 
                value={formData.issue} 
                onChange={(e) => handleChange('issue', e.target.value)}
                placeholder="Descreva o problema da empilhadeira"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportedBy">Reportado por</Label>
                <Select 
                  value={formData.reportedBy} 
                  onValueChange={handleReporterChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOperators.map(operator => (
                      <SelectItem key={operator.id} value={operator.name}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Data Reportada</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateForDisplay(formData.reportedDate || '')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(formData.reportedDate || '')}
                      onSelect={(date) => handleChange('reportedDate', format(date || new Date(), 'yyyy-MM-dd'))}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {formData.status === MaintenanceStatus.COMPLETED && (
              <div className="space-y-2">
                <Label>Data de Conclusão</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateForDisplay(formData.completedDate || '')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseDate(formData.completedDate || '')}
                      onSelect={(date) => handleChange('completedDate', format(date || new Date(), 'yyyy-MM-dd'))}
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Registrar Manutenção'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaintenanceDialog;
