
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { CertificateStatus, User, UserRole } from '@/types';
import { BadgeCheck, Filter, Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import OperatorDialog from '@/components/operators/OperatorDialog';
import OperatorDetails from '@/components/operators/OperatorDetails';
import { useToast } from '@/hooks/use-toast';

// Mock data for operators
const initialOperators: User[] = [
  {
    id: 'OP001',
    name: 'Carlos Silva',
    role: UserRole.OPERATOR,
    cpf: '123.456.789-10',
    contact: '(11) 98765-4321',
    shift: 'Manhã',
    registrationDate: '15/03/2022',
    asoExpirationDate: '15/03/2024',
    nrExpirationDate: '20/05/2024',
    asoStatus: CertificateStatus.REGULAR,
    nrStatus: CertificateStatus.REGULAR
  },
  {
    id: 'OP002',
    name: 'Maria Oliveira',
    role: UserRole.OPERATOR,
    cpf: '987.654.321-00',
    contact: '(11) 91234-5678',
    shift: 'Tarde',
    registrationDate: '10/06/2022',
    asoExpirationDate: '10/06/2023',
    nrExpirationDate: '15/08/2023',
    asoStatus: CertificateStatus.EXPIRED,
    nrStatus: CertificateStatus.EXPIRED
  },
  {
    id: 'OP003',
    name: 'João Pereira',
    role: UserRole.OPERATOR,
    cpf: '456.789.123-45',
    contact: '(11) 97654-3210',
    shift: 'Noite',
    registrationDate: '05/01/2023',
    asoExpirationDate: '05/01/2024',
    nrExpirationDate: '10/02/2024',
    asoStatus: CertificateStatus.WARNING,
    nrStatus: CertificateStatus.REGULAR
  },
  {
    id: 'OP004',
    name: 'Ana Costa',
    role: UserRole.OPERATOR,
    cpf: '789.123.456-78',
    contact: '(11) 94321-8765',
    shift: 'Manhã',
    registrationDate: '20/04/2023',
    asoExpirationDate: '20/04/2024',
    nrExpirationDate: '25/06/2023',
    asoStatus: CertificateStatus.REGULAR,
    nrStatus: CertificateStatus.WARNING
  },
  {
    id: 'SV001',
    name: 'Pedro Santos',
    role: UserRole.SUPERVISOR,
    cpf: '321.654.987-00',
    contact: '(11) 95678-1234',
    shift: 'Integral',
    registrationDate: '12/11/2021',
    asoExpirationDate: '12/11/2023',
    nrExpirationDate: '20/01/2024',
    asoStatus: CertificateStatus.WARNING,
    nrStatus: CertificateStatus.WARNING
  }
];

const OperatorsPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('all');
  const [certStatus, setCertStatus] = useState<string>('all');
  const [operators, setOperators] = useState<User[]>(initialOperators);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<User | null>(null);
  
  // Filter operators based on search and filters
  const filteredOperators = operators.filter(operator => {
    // Search filter
    const matchesSearch = operator.name.toLowerCase().includes(search.toLowerCase()) || 
                          operator.id.toLowerCase().includes(search.toLowerCase());
    
    // Role filter
    const matchesRole = role === 'all' || 
                       (role === 'operator' && operator.role === UserRole.OPERATOR) ||
                       (role === 'supervisor' && operator.role === UserRole.SUPERVISOR);
    
    // Certificate status filter
    const matchesCertStatus = certStatus === 'all' || 
                             (certStatus === 'regular' && 
                              operator.asoStatus === CertificateStatus.REGULAR && 
                              operator.nrStatus === CertificateStatus.REGULAR) ||
                             (certStatus === 'warning' && 
                              (operator.asoStatus === CertificateStatus.WARNING || 
                               operator.nrStatus === CertificateStatus.WARNING)) ||
                             (certStatus === 'expired' && 
                              (operator.asoStatus === CertificateStatus.EXPIRED || 
                               operator.nrStatus === CertificateStatus.EXPIRED));
    
    return matchesSearch && matchesRole && matchesCertStatus;
  });

  // Get status color classes
  const getStatusClass = (status: CertificateStatus) => {
    switch (status) {
      case CertificateStatus.REGULAR:
        return 'bg-status-operational/10 text-status-operational';
      case CertificateStatus.WARNING:
        return 'bg-status-maintenance/10 text-status-maintenance';
      case CertificateStatus.EXPIRED:
        return 'bg-status-warning/10 text-status-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Handle add/edit operator
  const handleSaveOperator = (operatorData: User) => {
    if (editDialogOpen) {
      // Update existing operator
      setOperators(prev => 
        prev.map(op => op.id === operatorData.id ? operatorData : op)
      );
    } else {
      // Add new operator
      setOperators(prev => [...prev, operatorData]);
    }
  };

  // Handle view operator details
  const handleViewDetails = (operator: User) => {
    setSelectedOperator(operator);
    setDetailsDialogOpen(true);
  };

  // Handle edit from details view
  const handleEditFromDetails = () => {
    setDetailsDialogOpen(false);
    setEditDialogOpen(true);
  };

  // Handle delete operator
  const handleDeleteOperator = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este operador?")) {
      setOperators(prev => prev.filter(op => op.id !== id));
      toast({
        title: "Operador excluído",
        description: "O operador foi excluído com sucesso."
      });
    }
  };

  // Handle filter toggle
  const handleFilterToggle = () => {
    // This would normally open a more complex filter dialog
    // For now, we'll just toggle filters being shown
    toast({
      title: "Filtros",
      description: "Esta funcionalidade permitiria filtros mais avançados."
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64" // Offset for sidebar when not mobile
      )}>
        <Navbar 
          title="Operadores" 
          subtitle="Gerenciamento de Operadores"
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Filter section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                type="text" 
                placeholder="Buscar operador..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleFilterToggle}
                >
                  <Filter className="w-4 h-4" />
                  Filtrar
                </Button>
              </div>
              <Button 
                className="gap-2"
                onClick={() => {
                  setSelectedOperator(null);
                  setAddDialogOpen(true);
                }}
              >
                <UserPlus className="w-4 h-4" />
                Novo Operador
              </Button>
            </div>
          </div>
          
          {/* Filter options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Função</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="operator">Operadores</option>
                <option value="supervisor">Supervisores</option>
              </select>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Status de Certificação</h4>
              <select 
                className="w-full p-2 rounded-md border border-input bg-background"
                value={certStatus}
                onChange={(e) => setCertStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="regular">Regular</option>
                <option value="warning">Próximo do Vencimento</option>
                <option value="expired">Vencido</option>
              </select>
            </div>
          </div>
          
          {/* Operators list */}
          <div className="bg-card rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 text-left font-medium text-muted-foreground">ID</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Nome</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Função</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">ASO</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">NR-11</th>
                    <th className="p-4 text-left font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOperators.map((operator) => (
                    <tr key={operator.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4">{operator.id}</td>
                      <td className="p-4">
                        <div className="font-medium">{operator.name}</div>
                        <div className="text-sm text-muted-foreground">{operator.contact}</div>
                      </td>
                      <td className="p-4">{operator.role}</td>
                      <td className="p-4">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
                          getStatusClass(operator.asoStatus)
                        )}>
                          <BadgeCheck className="w-3 h-3 mr-1" />
                          {operator.asoStatus}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vence: {operator.asoExpirationDate}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
                          getStatusClass(operator.nrStatus)
                        )}>
                          <BadgeCheck className="w-3 h-3 mr-1" />
                          {operator.nrStatus}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Vence: {operator.nrExpirationDate}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(operator)}
                          >
                            Detalhes
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteOperator(operator.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredOperators.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum operador encontrado</p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Add/Edit Operator Dialog */}
      <OperatorDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveOperator}
      />
      
      <OperatorDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        operator={selectedOperator || undefined}
        onSave={handleSaveOperator}
      />
      
      {/* Operator Details Dialog */}
      <OperatorDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        operator={selectedOperator}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
};

export default OperatorsPage;
