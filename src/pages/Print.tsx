import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import AppSidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Upload, Printer, FileText, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImportedServiceOrder {
  numeroOS: string;
  osCliente: string;
  denominacaoOS: string;
  denominacaoAtivo: string;
  observacoesAvaliacao: string;
  solicitante: string;
  denominacaoUnidadeNegocio: string;
}

const PrintPage: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [selectedOSNumber, setSelectedOSNumber] = useState('');
  const [selectedMultipleOS, setSelectedMultipleOS] = useState<string[]>([]);
  const [importedOrders, setImportedOrders] = useState<ImportedServiceOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate Excel import - in real app, use a library like xlsx
    const mockImportedData: ImportedServiceOrder[] = [
      {
        numeroOS: 'PRS-2024-001',
        osCliente: 'CLI-001',
        denominacaoOS: 'Manutenção Preventiva Sistema Hidráulico',
        denominacaoAtivo: 'Bomba Hidráulica BH-001',
        observacoesAvaliacao: 'Sistema apresenta vazamento na válvula principal',
        solicitante: 'João Silva',
        denominacaoUnidadeNegocio: 'Unidade Industrial Norte'
      },
      {
        numeroOS: 'PRS-2024-002',
        osCliente: 'CLI-002',
        denominacaoOS: 'Troca de Motor Elétrico',
        denominacaoAtivo: 'Motor Elétrico ME-002',
        observacoesAvaliacao: 'Motor com ruído excessivo e aquecimento',
        solicitante: 'Maria Santos',
        denominacaoUnidadeNegocio: 'Unidade Industrial Sul'
      },
      {
        numeroOS: 'PRS-2024-003',
        osCliente: 'CLI-003',
        denominacaoOS: 'Calibração de Sensores de Temperatura',
        denominacaoAtivo: 'Sensor Temperatura ST-003',
        observacoesAvaliacao: 'Leituras imprecisas nos últimos 3 meses',
        solicitante: 'Carlos Oliveira',
        denominacaoUnidadeNegocio: 'Unidade Industrial Leste'
      }
    ];

    setImportedOrders(mockImportedData);
    toast({
      title: "Dados importados",
      description: `${mockImportedData.length} ordens de serviço foram importadas do Excel`
    });
  };

  const handlePrintIndividual = () => {
    if (!selectedOSNumber) {
      toast({
        title: "Erro",
        description: "Selecione uma OS pelo número Prisma",
        variant: "destructive"
      });
      return;
    }

    // Simulate printing
    toast({
      title: "Impressão enviada",
      description: `OS ${selectedOSNumber} foi enviada para impressão`
    });
  };

  const handlePrintMultiple = () => {
    if (selectedMultipleOS.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma OS para impressão",
        variant: "destructive"
      });
      return;
    }

    // Simulate printing
    toast({
      title: "Impressão enviada",
      description: `${selectedMultipleOS.length} OS foram enviadas para impressão`
    });
  };

  const handleToggleOS = (osNumber: string) => {
    setSelectedMultipleOS(prev => 
      prev.includes(osNumber) 
        ? prev.filter(os => os !== osNumber)
        : [...prev, osNumber]
    );
  };

  const filteredOrders = importedOrders.filter(order =>
    order.numeroOS.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.denominacaoOS.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col pt-12">
        <Navbar 
          title="Impressão" 
          subtitle="Impressão de fichas de OS"
        />
        
        <main className="flex-1 px-6 py-6">
          <div className="space-y-6">
            {/* Excel Import Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Importar OS do Prisma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Importe as ordens de serviço do Excel com as seguintes colunas: 
                    Número OS, OS Cliente, Denominação OS, Denominação Ativo, 
                    Observações da Avaliação de Serviço, Solicitante, Denominação Unidade Negócio
                  </p>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="excel-file" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                        <FileText className="w-4 h-4" />
                        Selecionar arquivo Excel
                      </div>
                      <Input
                        id="excel-file"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleExcelImport}
                        className="hidden"
                      />
                    </Label>
                    {importedOrders.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {importedOrders.length} OS importadas
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Individual Print */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Printer className="w-5 h-5" />
                    Impressão Individual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="os-number">Número da OS (Prisma)</Label>
                    <Input
                      id="os-number"
                      placeholder="Digite o número da OS..."
                      value={selectedOSNumber}
                      onChange={(e) => setSelectedOSNumber(e.target.value)}
                    />
                  </div>
                  <Button onClick={handlePrintIndividual} className="w-full">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir OS
                  </Button>
                </CardContent>
              </Card>

              {/* Multiple Print */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Printer className="w-5 h-5" />
                    Impressão em Lista
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Selecione múltiplas OS da lista importada para impressão
                  </p>
                  <Button 
                    onClick={handlePrintMultiple} 
                    className="w-full"
                    disabled={selectedMultipleOS.length === 0}
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir {selectedMultipleOS.length} OS Selecionadas
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* OS List for Selection */}
            {importedOrders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Total de OS Importadas</CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <Input
                      placeholder="Buscar OS..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredOrders.map((order, index) => (
                      <div key={index}>
                        <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50">
                          <Checkbox
                            checked={selectedMultipleOS.includes(order.numeroOS)}
                            onCheckedChange={() => handleToggleOS(order.numeroOS)}
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{order.numeroOS}</h4>
                              <span className="text-sm text-muted-foreground">
                                Cliente: {order.osCliente}
                              </span>
                            </div>
                            <p className="text-sm font-medium">{order.denominacaoOS}</p>
                            <p className="text-sm text-muted-foreground">{order.denominacaoAtivo}</p>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p><strong>Solicitante:</strong> {order.solicitante}</p>
                              <p><strong>Unidade:</strong> {order.denominacaoUnidadeNegocio}</p>
                              <p><strong>Observações:</strong> {order.observacoesAvaliacao}</p>
                            </div>
                          </div>
                        </div>
                        {index < filteredOrders.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrintPage;