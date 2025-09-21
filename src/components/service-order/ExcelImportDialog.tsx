import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import * as XLSX from 'xlsx';

interface ExcelImportDialogProps {
  onImport?: () => void;
}

const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({ onImport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
    if (!file || !user) {
      toast({
        title: "Erro",
        description: !file ? "Por favor, selecione um arquivo Excel para importar" : "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Read Excel file
      const fileBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const rawData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log('Raw Excel data:', rawData);

      if (!rawData.length) {
        throw new Error('O arquivo Excel está vazio ou não possui dados válidos');
      }

      // Map Excel columns to database fields
      const excelData = rawData.map((row: any) => ({
        numero_os: row['Número OS'] || row['numero_os'] || '',
        numero_os_cliente: row['OS Cliente'] || row['numero_os_cliente'] || '',
        denominacao_os: row['Denominação OS'] || row['denominacao_os'] || '',
        tipo_solicitacao_servico: row['Tipo Solic. de Serviço'] || row['tipo_solicitacao_servico'] || '',
        denominacao_oficina: row['Denominação Oficina'] || row['denominacao_oficina'] || '',
        ativo: row['Ativo'] || row['ativo'] || '',
        denominacao_ativo: row['Denominação Ativo'] || row['denominacao_ativo'] || '',
        observacoes_avaliacao_servico: row['Observações da Avaliação de Serviço'] || row['observacoes_avaliacao_servico'] || '',
        denominacao_solicitante: row['Denominação do Solicitante'] || row['denominacao_solicitante'] || '',
        denominacao_unidade_negocio: row['Denominação Unidade Negócio'] || row['denominacao_unidade_negocio'] || '',
        status: row['Status'] || row['status'] || 'Aguardando Programação'
      }));

      // Filter valid records (must have numero_os)
      const validData = excelData.filter(item => item.numero_os && item.numero_os.trim());

      if (!validData.length) {
        throw new Error('Nenhum registro válido encontrado. Verifique se a coluna "Número OS" está preenchida.');
      }

      console.log('Valid Excel data:', validData);

      // Call sync function
      const { data, error } = await supabase.functions.invoke('sync-excel-data', {
        body: {
          data: validData,
          userId: user.id
        }
      });

      if (error) {
        console.error('Sync error:', error);
        throw new Error(error.message || 'Erro ao sincronizar dados');
      }

      const result = data;
      console.log('Sync result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido durante a sincronização');
      }

      toast({
        title: "Importação concluída",
        description: `${result.stats.total} registros processados. ${result.stats.upserted} atualizados/inseridos, ${result.stats.deleted} removidos.`
      });

      onImport?.();
      setIsOpen(false);
      setFile(null);
      
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Erro na importação",
        description: error?.message || "Ocorreu um erro ao processar o arquivo. Tente novamente.",
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
            <p><strong>Colunas esperadas no Excel:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
              <li>Número OS <span className="text-red-500">*</span></li>
              <li>OS Cliente</li>
              <li>Denominação OS</li>
              <li>Tipo Solic. de Serviço</li>
              <li>Denominação Oficina</li>
              <li>Ativo</li>
              <li>Denominação Ativo</li>
              <li>Observações da Avaliação de Serviço</li>
              <li>Denominação do Solicitante</li>
              <li>Denominação Unidade Negócio</li>
            </ul>
            <p className="text-xs text-red-500 mt-2">* Campo obrigatório</p>
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