import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceOrder, ServiceOrderStatus } from '@/types';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewServiceOrderDialogProps {
  onAddServiceOrder: (serviceOrder: ServiceOrder) => void;
}

const NewServiceOrderDialog: React.FC<NewServiceOrderDialogProps> = ({ onAddServiceOrder }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    osPrisma: '',
    osMaximo: '',
    description: '',
    workshop: '',
    technicians: [''],
    location: '',
    sector: ''
  });

  const workshops = [
    'Oficina Mecânica',
    'Oficina Elétrica',
    'Oficina Instrumentação',
    'Oficina Hidráulica',
    'Oficina Pneumática'
  ];

  const sectors = [
    'Produção',
    'Montagem',
    'Instrumentação',
    'Utilidades',
    'Qualidade',
    'Manutenção'
  ];

  const addTechnician = () => {
    setFormData(prev => ({
      ...prev,
      technicians: [...prev.technicians, '']
    }));
  };

  const removeTechnician = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technicians: prev.technicians.filter((_, i) => i !== index)
    }));
  };

  const updateTechnician = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      technicians: prev.technicians.map((tech, i) => i === index ? value : tech)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.osPrisma || !formData.osMaximo || !formData.description || !formData.workshop) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty technicians
    const filteredTechnicians = formData.technicians.filter(tech => tech.trim() !== '');
    
    if (filteredTechnicians.length === 0) {
      toast({
        title: "Erro de validação",
        description: "Pelo menos um técnico deve ser especificado.",
        variant: "destructive"
      });
      return;
    }

    const newServiceOrder: ServiceOrder = {
      id: `OS${Date.now()}`,
      osPrisma: formData.osPrisma,
      osMaximo: formData.osMaximo,
      description: formData.description,
      workshop: formData.workshop,
      technicians: filteredTechnicians,
      location: formData.location,
      sector: formData.sector,
      status: ServiceOrderStatus.WAITING_SCHEDULE,
      createdDate: new Date().toLocaleDateString('pt-BR'),
    };

    onAddServiceOrder(newServiceOrder);
    
    // Reset form
    setFormData({
      osPrisma: '',
      osMaximo: '',
      description: '',
      workshop: '',
      technicians: [''],
      location: '',
      sector: ''
    });
    
    setOpen(false);
    
    toast({
      title: "OS criada com sucesso",
      description: `A ordem de serviço ${formData.osPrisma} foi criada.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova OS
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Serviço</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="osPrisma">OS Prisma *</Label>
              <Input
                id="osPrisma"
                value={formData.osPrisma}
                onChange={(e) => setFormData(prev => ({ ...prev, osPrisma: e.target.value }))}
                placeholder="Ex: PRS-2024-001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="osMaximo">OS Máximo *</Label>
              <Input
                id="osMaximo"
                value={formData.osMaximo}
                onChange={(e) => setFormData(prev => ({ ...prev, osMaximo: e.target.value }))}
                placeholder="Ex: MAX-45678"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o serviço a ser realizado..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workshop">Oficina *</Label>
              <Select value={formData.workshop} onValueChange={(value) => setFormData(prev => ({ ...prev, workshop: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a oficina" />
                </SelectTrigger>
                <SelectContent>
                  {workshops.map((workshop) => (
                    <SelectItem key={workshop} value={workshop}>{workshop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sector">Setor</Label>
              <Select value={formData.sector} onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: Setor A - Linha 1"
            />
          </div>

          <div className="space-y-2">
            <Label>Técnicos *</Label>
            {formData.technicians.map((technician, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={technician}
                  onChange={(e) => updateTechnician(index, e.target.value)}
                  placeholder="Nome do técnico"
                />
                {formData.technicians.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeTechnician(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addTechnician}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Técnico
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar OS
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewServiceOrderDialog;