
import React, { useState, useEffect } from 'react';
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
import { GasSupply } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';

interface GasSupplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gasSupply?: GasSupply;
  onSave: (gasSupply: GasSupply) => void;
  availableForklifts: { id: string; model: string }[];
  availableOperators: { id: string; name: string }[];
}

const GasSupplyDialog = ({ 
  open, 
  onOpenChange, 
  gasSupply, 
  onSave,
  availableForklifts,
  availableOperators 
}: GasSupplyDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!gasSupply;
  
  const [formData, setFormData] = useState<Partial<GasSupply>>(
    gasSupply || {
      id: `GS${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      forkliftId: '',
      forkliftModel: '',
      quantity: 0,
      hourMeterBefore: 0,
      hourMeterAfter: 0,
      operator: ''
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

  // Handle operator selection
  const handleOperatorChange = (operatorName: string) => {
    setFormData(prev => ({ ...prev, operator: operatorName }));
  };

  // Handle form field changes
  const handleChange = (field: keyof GasSupply, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Parse date string to Date object
  const parseDate = (dateStr: string): Date => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    } catch (e) {
      return new Date();
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.forkliftId || !formData.quantity || !formData.hourMeterBefore || !formData.hourMeterAfter || !formData.operator) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.hourMeterAfter <= formData.hourMeterBefore) {
      toast({
        title: "Erro de validação",
        description: "O horímetro final deve ser maior que o inicial",
        variant: "destructive"
      });
      return;
    }
    
    // Save gas supply
    onSave(formData as GasSupply);
    
    // Reset form and close dialog
    if (!isEditing) {
      setFormData({
        id: `GS${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        date: format(new Date(), 'yyyy-MM-dd'),
        forkliftId: '',
        forkliftModel: '',
        quantity: 0,
        hourMeterBefore: 0,
        hourMeterAfter: 0,
        operator: ''
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: isEditing ? "Abastecimento atualizado" : "Abastecimento registrado",
      description: `Abastecimento ${isEditing ? 'atualizado' : 'registrado'} com sucesso!`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Abastecimento' : 'Novo Abastecimento'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do abastecimento nos campos abaixo.' 
              : 'Preencha as informações do novo abastecimento nos campos abaixo.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateForDisplay(formData.date || '')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseDate(formData.date || '')}
                    onSelect={(date) => handleChange('date', format(date || new Date(), 'yyyy-MM-dd'))}
                    locale={ptBR}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
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
              <Label htmlFor="quantity">Quantidade (L)</Label>
              <Input 
                id="quantity" 
                type="number"
                step="0.1"
                min="0"
                value={formData.quantity} 
                onChange={(e) => handleChange('quantity', parseFloat(e.target.value))}
                placeholder="0.0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="operator">Operador</Label>
              <Select 
                value={formData.operator} 
                onValueChange={handleOperatorChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o operador" />
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
              <Label htmlFor="hourMeterBefore">Horímetro Inicial</Label>
              <Input 
                id="hourMeterBefore" 
                type="number"
                min="0"
                value={formData.hourMeterBefore} 
                onChange={(e) => handleChange('hourMeterBefore', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hourMeterAfter">Horímetro Final</Label>
              <Input 
                id="hourMeterAfter" 
                type="number"
                min="0"
                value={formData.hourMeterAfter} 
                onChange={(e) => handleChange('hourMeterAfter', parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Registrar Abastecimento'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GasSupplyDialog;
