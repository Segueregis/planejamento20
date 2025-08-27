
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Filter, Plus, Search, Truck, User } from 'lucide-react';
import { Operation } from '@/types';
import { useToast } from '@/hooks/use-toast';
import OperationDialog from '@/components/operations/OperationDialog';
import OperationDetails from '@/components/operations/OperationDetails';

// Mock data for operations
const initialOperations: Operation[] = [
  {
    id: 'OP001',
    operatorId: 'OP001',
    operatorName: 'Carlos Silva',
    forkliftId: 'G001',
    forkliftModel: 'Toyota 8FGU25',
    sector: 'Armazém A',
    initialHourMeter: 12500,
    currentHourMeter: 12583,
    gasConsumption: 25.5,
    startTime: '2023-11-20T08:00:00',
    status: 'active'
  },
  {
    id: 'OP002',
    operatorId: 'OP002',
    operatorName: 'Maria Oliveira',
    forkliftId: 'E002',
    forkliftModel: 'Hyster E50XN',
    sector: 'Expedição',
    initialHourMeter: 8400,
    currentHourMeter: 8452,
    startTime: '2023-11-20T14:00:00',
    status: 'active'
  },
  {
    id: 'OP003',
    operatorId: 'OP003',
    operatorName: 'João Pereira',
    forkliftId: 'G004',
    forkliftModel: 'Yale GLP050',
    sector: 'Recebimento',
    initialHourMeter: 6700,
    currentHourMeter: 6782,
    gasConsumption: 18.2,
    startTime: '2023-11-19T22:00:00',
    endTime: '2023-11-20T06:00:00',
    status: 'completed'
  },
  {
    id: 'OP004',
    operatorId: 'OP004',
    operatorName: 'Ana Costa',
    forkliftId: 'E002',
    forkliftModel: 'Hyster E50XN',
    sector: 'Armazém B',
    initialHourMeter: 8350,
    currentHourMeter: 8400,
    startTime: '2023-11-19T08:00:00',
    endTime: '2023-11-19T16:00:00',
    status: 'completed'
  },
];

// Mock data for available operators and forklifts
const availableOperators = [
  { id: 'OP001', name: 'Carlos Silva' },
  { id: 'OP002', name: 'Maria Oliveira' },
  { id: 'OP003', name: 'João Pereira' },
  { id: 'OP004', name: 'Ana Costa' },
  { id: 'OP005', name: 'Pedro Santos' }
];

const availableForklifts = [
  { id: 'G001', model: 'Toyota 8FGU25' },
  { id: 'G004', model: 'Yale GLP050' },
  { id: 'E002', model: 'Hyster E50XN' },
  { id: 'G006', model: 'Caterpillar DP40' }
];

const OperationsPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [sector, setSector] = useState<string>('all');
  const [operations, setOperations] = useState<Operation[]>(initialOperations);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  
  // Filter operations based on search and filters
  const filteredOperations = operations.filter(operation => {
    // Search filter
    const matchesSearch = operation.operatorName.toLowerCase().includes(search.toLowerCase()) || 
                          operation.forkliftModel.toLowerCase().includes(search.toLowerCase()) ||
                          operation.sector.toLowerCase().includes(search.toLowerCase()) ||
                          operation.id.toLowerCase().includes(search.toLowerCase());
    
    // Status filter
    const matchesStatus = status === 'all' || operation.status === status;
    
    // Sector filter
    const matchesSector = sector === 'all' || operation.sector === sector;
    
    return matchesSearch && matchesStatus && matchesSector;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get unique sectors for filter
  const sectors = [...new Set(operations.map(op => op.sector))];

  // Handle save operation
  const handleSaveOperation = (operationData: Operation) => {
    const isNewOperation = !operations.some(op => op.id === operationData.id);
    
    if (isNewOperation) {
      // Add new operation
      setOperations(prev => [operationData, ...prev]);
      toast({
        title: "Operação criada",
        description: "A operação foi criada com sucesso."
      });
    } else {
      // Update existing operation
      setOperations(prev => 
        prev.map(op => op.id === operationData.id ? operationData : op)
      );
      toast({
        title: "Operação atualizada",
        description: "A operação foi atualizada com sucesso."
      });
    }
  };

  // Open details dialog
  const handleViewDetails = (operation: Operation) => {
    setSelectedOperation(operation);
    setDetailsDialogOpen(true);
  };

  // Open edit dialog from details
  const handleEditFromDetails = () => {
    setDetailsDialogOpen(false);
    setEditDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64" // Offset for sidebar when not mobile
      )}>
        <Navbar 
          title="Operações" 
          subtitle="Controle de Operações"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Filter section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Buscar operação..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </Button>
              </div>
              <Button 
                className="gap-2"
                onClick={() => {
                  setSelectedOperation(null);
                  setAddDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Nova Operação
              </Button>
            </div>
          </div>
          
          {/* Filter options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Status</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="active">Em Andamento</option>
                <option value="completed">Concluídas</option>
              </select>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Setor</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              >
                <option value="all">Todos</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active Operations */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Operações em Andamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOperations
                .filter(op => op.status === 'active')
                .map((operation) => (
                  <div key={operation.id} className="bg-card border rounded-lg overflow-hidden shadow">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{operation.operatorName}</h3>
                          <p className="text-sm text-muted-foreground">ID: {operation.id}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-status-operational/10 text-status-operational">
                          Em Andamento
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{operation.forkliftModel} ({operation.forkliftId})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{operation.operatorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(operation.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">Início: {formatTime(operation.startTime)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t px-4 py-3 bg-muted/30 flex justify-between">
                      <span className="text-sm">Setor: {operation.sector}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(operation)}
                      >
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              
              {filteredOperations.filter(op => op.status === 'active').length === 0 && (
                <div className="col-span-full p-8 text-center bg-card border rounded-lg">
                  <p className="text-muted-foreground">Nenhuma operação em andamento</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Completed Operations */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Operações Concluídas</h2>
            <div className="bg-card rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-4 text-left font-medium text-muted-foreground">ID</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Operador</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Empilhadeira</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Setor</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Data</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Período</th>
                      <th className="p-4 text-left font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredOperations
                      .filter(op => op.status === 'completed')
                      .map((operation) => (
                        <tr key={operation.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-4">{operation.id}</td>
                          <td className="p-4">{operation.operatorName}</td>
                          <td className="p-4">
                            <div>{operation.forkliftModel}</div>
                            <div className="text-xs text-muted-foreground">{operation.forkliftId}</div>
                          </td>
                          <td className="p-4">{operation.sector}</td>
                          <td className="p-4">{formatDate(operation.startTime)}</td>
                          <td className="p-4">
                            {formatTime(operation.startTime)} - {operation.endTime ? formatTime(operation.endTime) : 'Em andamento'}
                          </td>
                          <td className="p-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(operation)}
                            >
                              Detalhes
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              {filteredOperations.filter(op => op.status === 'completed').length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhuma operação concluída</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Operation Dialog */}
      <OperationDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveOperation}
        availableOperators={availableOperators}
        availableForklifts={availableForklifts}
      />
      
      {/* Edit Operation Dialog */}
      <OperationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        operation={selectedOperation || undefined}
        onSave={handleSaveOperation}
        availableOperators={availableOperators}
        availableForklifts={availableForklifts}
      />
      
      {/* Operation Details Dialog */}
      <OperationDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        operation={selectedOperation}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
};

export default OperationsPage;
