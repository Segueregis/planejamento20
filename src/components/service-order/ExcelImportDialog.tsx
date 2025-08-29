import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ServiceOrder, ServiceOrderStatus } from '@/types';

interface ExcelImportDialogProps {
  onImport: (orders: ServiceOrder[]) => void;
}

const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({ onImport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.includes('sheet') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
          variant: "destructive"
        });
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo Excel para importar",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock data for demonstration - in real implementation, you would parse the Excel file
      const mockImportedOrders: ServiceOrder[] = [
        {
          id: `IMPORT-${Date.now()}-1`,
          osPrisma: 'PRS-IMP-001',
          osMaximo: 'MAX-IMP-001',
          description: 'Manutenção corretiva importada do Prisma',
          workshop: 'Oficina Mecânica',
          technicians: ['João Silva'],
          location: 'Setor A - Importado',
          sector: 'Produção',
          status: ServiceOrderStatus.WAITING_SCHEDULE,
          createdDate: new Date().toLocaleDateString('pt-BR'),
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
        },
        {
          id: `IMPORT-${Date.now()}-2`,
          osPrisma: 'PRS-IMP-002',
          osMaximo: 'MAX-IMP-002',
          description: 'Calibração de equipamento importada',
          workshop: 'Oficina Instrumentação',
          technicians: ['Maria Santos'],
          location: 'Setor B - Importado',
          sector: 'Instrumentação',
          status: ServiceOrderStatus.WAITING_SCHEDULE,
          createdDate: new Date().toLocaleDateString('pt-BR'),
          scheduledDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
        }
      ];

      onImport(mockImportedOrders);
      
      toast({
        title: "Importação concluída",
        description: `${mockImportedOrders.length} ordens de serviço foram importadas com sucesso`
      });

      setIsOpen(false);
      setFile(null);
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao processar o arquivo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Importar OS do Prisma
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Ordens de Serviço</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <FileSpreadsheet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Selecione o arquivo Excel com as ordens de serviço do Prisma
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="excel-file" className="sr-only">
                Arquivo Excel
              </Label>
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            
            {file && (
              <div className="mt-4 p-2 bg-muted rounded text-sm">
                <strong>Arquivo selecionado:</strong> {file.name}
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            <p><strong>Formato esperado:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>OS Prisma</li>
              <li>OS Máximo</li>
              <li>Descrição</li>
              <li>Oficina</li>
              <li>Técnico(s)</li>
              <li>Local</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!file || isLoading}
            >
              {isLoading ? "Importando..." : "Importar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImportDialog;