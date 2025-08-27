
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Operation } from '@/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface OperationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operation?: Operation;
  onSave: (operation: Operation) => void;
  availableOperators: { id: string; name: string }[];
  availableForklifts: { id: string; model: string }[];
}

const OperationDialog = ({ 
  open, 
  onOpenChange, 
  operation, 
  onSave,
  availableOperators,
  availableForklifts
}: OperationDialogProps) => {
  const { toast } = useToast();
  const isEditing = !!operation;
  
  // Form state
  const [formData, setFormData] = useState<Partial<Operation>>({
    operatorId: '',
    operatorName: '',
    forkliftId: '',
    forkliftModel: '',
    sector: '',
    initialHourMeter: 0,
    currentHourMeter: 0,
    startTime: new Date().toISOString().slice(0, 16),
    status: 'active'
  });

  // Initialize form with operation data if editing
  useEffect(() => {
    if (operation) {
      setFormData({
        ...operation,
        startTime: new Date(operation.startTime).toISOString().slice(0, 16),
        endTime: operation.endTime ? new Date(operation.endTime).toISOString().slice(0, 16) : undefined
      });
    } else {
      // Reset form for new operation
      setFormData({
        operatorId: '',
        operatorName: '',
        forkliftId: '',
        forkliftModel: '',
        sector: '',
        initialHourMeter: 0,
        currentHourMeter: 0,
        startTime: new Date().toISOString().slice(0, 16),
        status: 'active'
      });
    }
  }, [operation, open]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  // Handle operator selection
  const handleOperatorChange = (operatorId: string) => {
    const selectedOperator = availableOperators.find(op => op.id === operatorId);
    if (selectedOperator) {
      setFormData(prev => ({
        ...prev,
        operatorId,
        operatorName: selectedOperator.name
      }));
    }
  };

  // Handle forklift selection
  const handleForkliftChange = (forkliftId: string) => {
    const selectedForklift = availableForklifts.find(f => f.id === forkliftId);
    if (selectedForklift) {
      setFormData(prev => ({
        ...prev,
        forkliftId,
        forkliftModel: selectedForklift.model
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.operatorId || !formData.forkliftId || !formData.sector || !formData.startTime) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Generate ID for new operations
    const operationData: Operation = {
      id: operation?.id || `OP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...formData as Operation
    };

    // Save the operation
    onSave(operationData);
    
    // Close the dialog
    onOpenChange(false);
  };

  // Calculate if the operation can be completed
  const canComplete = isEditing && operation?.status === 'active';

  // Complete the operation
  const handleComplete = () => {
    const now = new Date();
    const completedOperation: Operation = {
      ...formData as Operation,
      status: 'completed',
      endTime: now.toISOString()
    };
    
    onSave(completedOperation);
    onOpenChange(false);
    
    toast({
      title: "Operação concluída",
      description: "A operação foi finalizada com sucesso."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Operação' : 'Nova Operação'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operatorId">Operador</Label>
              <Select 
                value={formData.operatorId} 
                onValueChange={handleOperatorChange}
              >
                <SelectTrigger id="operatorId">
                  <SelectValue placeholder="Selecione um operador" />
                </SelectTrigger>
                <SelectContent>
                  {availableOperators.map(operator => (
                    <SelectItem key={operator.id} value={operator.id}>
                      {operator.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="forkliftId">Empilhadeira</Label>
              <Select 
                value={formData.forkliftId}
                onValueChange={handleForkliftChange}
              >
                <SelectTrigger id="forkliftId">
                  <SelectValue placeholder="Selecione uma empilhadeira" />
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector">Setor</Label>
            <Input
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              placeholder="Ex: Armazém A, Expedição, etc."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialHourMeter">Horímetro Inicial</Label>
              <Input
                id="initialHourMeter"
                name="initialHourMeter"
                type="number"
                value={formData.initialHourMeter}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentHourMeter">Horímetro Atual</Label>
              <Input
                id="currentHourMeter"
                name="currentHourMeter"
                type="number"
                value={formData.currentHourMeter || formData.initialHourMeter}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Data/Hora de Início</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="endTime">Data/Hora de Término</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime || ''}
                  onChange={handleChange}
                  disabled={formData.status === 'active'}
                />
              </div>
            )}
          </div>
          
          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="gasConsumption">Consumo de Combustível (L)</Label>
              <Input
                id="gasConsumption"
                name="gasConsumption"
                type="number"
                step="0.1"
                value={formData.gasConsumption || ''}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
          )}
          
          <DialogFooter className="pt-4">
            {canComplete && (
              <Button 
                type="button" 
                variant="outline" 
                className="mr-auto" 
                onClick={handleComplete}
              >
                Finalizar Operação
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Salvar Alterações' : 'Criar Operação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OperationDialog;
