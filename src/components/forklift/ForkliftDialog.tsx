
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
import { Forklift, ForkliftStatus, ForkliftType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface ForkliftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  forklift?: Forklift;
  onSave: (forklift: Forklift) => void;
}

const ForkliftDialog = ({ open, onOpenChange, forklift, onSave }: ForkliftDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!forklift;
  
  const [formData, setFormData] = useState<Partial<Forklift>>(
    forklift || {
      id: `${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      model: '',
      type: ForkliftType.GAS,
      capacity: '',
      acquisitionDate: '01/01/2023',
      lastMaintenance: format(new Date(), 'dd/MM/yyyy'),
      status: ForkliftStatus.OPERATIONAL,
      hourMeter: 0
    }
  );

  // Handle form field changes
  const handleChange = (field: keyof Forklift, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Parse date string to Date object (dd/MM/yyyy -> Date)
  const parseDate = (dateStr: string): Date => {
    try {
      const [day, month, year] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return new Date();
    }
  };

  // Format date for display (Date -> dd/MM/yyyy)
  const formatDateString = (date: Date): string => {
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.model || !formData.capacity) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Save forklift
    onSave(formData as Forklift);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        model: '',
        type: ForkliftType.GAS,
        capacity: '',
        acquisitionDate: '01/01/2023',
        lastMaintenance: format(new Date(), 'dd/MM/yyyy'),
        status: ForkliftStatus.OPERATIONAL,
        hourMeter: 0
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Empilhadeira atualizada" : "Empilhadeira adicionada",
      description: `${formData.model} foi ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Empilhadeira' : 'Adicionar Nova Empilhadeira'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações da empilhadeira nos campos abaixo.' 
              : 'Preencha as informações da nova empilhadeira nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input 
                id="id" 
                value={formData.id} 
                onChange={(e) => handleChange('id', e.target.value)}
                disabled={isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ForkliftType.GAS}>Gás</SelectItem>
                  <SelectItem value={ForkliftType.ELECTRIC}>Elétrica</SelectItem>
                  <SelectItem value={ForkliftType.RETRACTABLE}>Retrátil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Modelo</Label>
              <Input 
                id="model" 
                value={formData.model} 
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="Ex: Toyota 8FGU25"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade</Label>
              <Input 
                id="capacity" 
                value={formData.capacity} 
                onChange={(e) => handleChange('capacity', e.target.value)}
                placeholder="Ex: 2.500 kg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hourMeter">Horímetro</Label>
              <Input 
                id="hourMeter" 
                type="number"
                min="0"
                value={formData.hourMeter} 
                onChange={(e) => handleChange('hourMeter', parseInt(e.target.value))}
              />
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
                  <SelectItem value={ForkliftStatus.OPERATIONAL}>Em Operação</SelectItem>
                  <SelectItem value={ForkliftStatus.MAINTENANCE}>Aguardando Manutenção</SelectItem>
                  <SelectItem value={ForkliftStatus.STOPPED}>Parada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Data de Aquisição</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.acquisitionDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.acquisitionDate || '')}
                  onSelect={(date) => handleChange('acquisitionDate', formatDateString(date || new Date()))}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Última Manutenção</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.lastMaintenance}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDate(formData.lastMaintenance || '')}
                  onSelect={(date) => handleChange('lastMaintenance', formatDateString(date || new Date()))}
                  locale={ptBR}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Adicionar Empilhadeira'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForkliftDialog;
