
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Forklift, ForkliftStatus, ForkliftType } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search } from 'lucide-react';
import ForkliftList from '@/components/forklift/ForkliftList';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import ForkliftDialog from '@/components/forklift/ForkliftDialog';
import ForkliftDetails from '@/components/forklift/ForkliftDetails';
import { useToast } from '@/hooks/use-toast';

// Mock data for the forklifts
const initialForklifts: Forklift[] = [
  {
    id: 'G001',
    model: 'Toyota 8FGU25',
    type: ForkliftType.GAS,
    capacity: '2.500 kg',
    acquisitionDate: '10/05/2022',
    lastMaintenance: '15/09/2023',
    status: ForkliftStatus.OPERATIONAL,
    hourMeter: 12583,
  },
  {
    id: 'E002',
    model: 'Hyster E50XN',
    type: ForkliftType.ELECTRIC,
    capacity: '2.250 kg',
    acquisitionDate: '22/11/2021',
    lastMaintenance: '30/10/2023',
    status: ForkliftStatus.OPERATIONAL,
    hourMeter: 8452,
  },
  {
    id: 'R003',
    model: 'Crown RR5725',
    type: ForkliftType.RETRACTABLE,
    capacity: '1.800 kg',
    acquisitionDate: '04/03/2022',
    lastMaintenance: '12/08/2023',
    status: ForkliftStatus.MAINTENANCE,
    hourMeter: 10974,
  },
  {
    id: 'G004',
    model: 'Yale GLP050',
    type: ForkliftType.GAS,
    capacity: '2.200 kg',
    acquisitionDate: '18/07/2022',
    lastMaintenance: '05/11/2023',
    status: ForkliftStatus.STOPPED,
    hourMeter: 6782,
  },
  {
    id: 'E005',
    model: 'Toyota 8FBMT30',
    type: ForkliftType.ELECTRIC,
    capacity: '3.000 kg',
    acquisitionDate: '25/02/2023',
    lastMaintenance: '10/11/2023',
    status: ForkliftStatus.OPERATIONAL,
    hourMeter: 3209,
  },
  {
    id: 'G006',
    model: 'Caterpillar DP40',
    type: ForkliftType.GAS,
    capacity: '4.000 kg',
    acquisitionDate: '12/08/2021',
    lastMaintenance: '22/09/2023',
    status: ForkliftStatus.OPERATIONAL,
    hourMeter: 15842,
  },
  {
    id: 'R007',
    model: 'Jungheinrich ETR340',
    type: ForkliftType.RETRACTABLE,
    capacity: '1.400 kg',
    acquisitionDate: '30/05/2022',
    lastMaintenance: '17/10/2023',
    status: ForkliftStatus.STOPPED,
    hourMeter: 7632,
  },
  {
    id: 'E008',
    model: 'Linde E20PH',
    type: ForkliftType.ELECTRIC,
    capacity: '2.000 kg',
    acquisitionDate: '05/11/2022',
    lastMaintenance: '01/11/2023',
    status: ForkliftStatus.MAINTENANCE,
    hourMeter: 5216,
  },
];

const ForkliftsPage = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [forklifts, setForklifts] = useState<Forklift[]>(initialForklifts);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ForkliftStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ForkliftType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedForklift, setSelectedForklift] = useState<Forklift | null>(null);
  
  React.useEffect(() => {
    // Set current date in Brazilian format
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const dateStr = now.toLocaleDateString('pt-BR', options);
    // First letter uppercase
    setCurrentDate(dateStr.charAt(0).toUpperCase() + dateStr.slice(1));
  }, []);

  // Filter forklifts based on status, type, and search query
  const filteredForklifts = forklifts.filter(forklift => {
    // Status filter
    if (statusFilter !== 'all' && forklift.status !== statusFilter) {
      return false;
    }
    
    // Type filter
    if (typeFilter !== 'all' && forklift.type !== typeFilter) {
      return false;
    }
    
    // Search query
    if (searchQuery && !forklift.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !forklift.model.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Handle add/edit forklift
  const handleSaveForklift = (forkliftData: Forklift) => {
    if (editDialogOpen) {
      // Update existing forklift
      setForklifts(prev => 
        prev.map(f => f.id === forkliftData.id ? forkliftData : f)
      );
    } else {
      // Add new forklift
      setForklifts(prev => [...prev, forkliftData]);
    }
  };

  // Handle forklift click
  const handleForkliftClick = (id: string) => {
    const forklift = forklifts.find(f => f.id === id);
    if (forklift) {
      setSelectedForklift(forklift);
      setDetailsDialogOpen(true);
    }
  };

  // Handle edit from details view
  const handleEditFromDetails = () => {
    setDetailsDialogOpen(false);
    setEditDialogOpen(true);
  };

  // Handle delete forklift
  const handleDeleteForklift = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta empilhadeira?")) {
      setForklifts(prev => prev.filter(f => f.id !== id));
      toast({
        title: "Empilhadeira excluída",
        description: "A empilhadeira foi excluída com sucesso."
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64" // Offset for sidebar when not mobile
      )}>
        <Navbar 
          title="Empilhadeiras" 
          subtitle={currentDate}
        />
        
        <main className="flex-1 px-6 py-6">
          {/* Header with actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Gerenciamento de Empilhadeiras</h1>
              <p className="text-muted-foreground">Gerencie sua frota de empilhadeiras</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex gap-2 items-center"
                onClick={() => toast({
                  title: "Filtros avançados",
                  description: "Esta funcionalidade permitiria filtros mais avançados."
                })}
              >
                <Filter size={16} />
                Filtrar
              </Button>
              <Button 
                className="flex gap-2 items-center"
                onClick={() => {
                  setSelectedForklift(null);
                  setAddDialogOpen(true);
                }}
              >
                <Plus size={16} />
                Nova Empilhadeira
              </Button>
            </div>
          </div>
          
          {/* Search and filters */}
          <div className="glass-card p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por ID ou modelo..."
                  className="pl-10 h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Status filter */}
              <div>
                <select 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ForkliftStatus | 'all')}
                >
                  <option value="all">Todos os Status</option>
                  <option value={ForkliftStatus.OPERATIONAL}>{ForkliftStatus.OPERATIONAL}</option>
                  <option value={ForkliftStatus.MAINTENANCE}>{ForkliftStatus.MAINTENANCE}</option>
                  <option value={ForkliftStatus.STOPPED}>{ForkliftStatus.STOPPED}</option>
                </select>
              </div>
              
              {/* Type filter */}
              <div>
                <select 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as ForkliftType | 'all')}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value={ForkliftType.GAS}>{ForkliftType.GAS}</option>
                  <option value={ForkliftType.ELECTRIC}>{ForkliftType.ELECTRIC}</option>
                  <option value={ForkliftType.RETRACTABLE}>{ForkliftType.RETRACTABLE}</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Forklift list */}
          <div className="slide-enter">
            <ForkliftList 
              forklifts={filteredForklifts}
              onForkliftClick={handleForkliftClick}
              onDeleteForklift={handleDeleteForklift}
            />
            
            {/* Pagination */}
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </main>
      </div>
      
      {/* Add/Edit Forklift Dialog */}
      <ForkliftDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onSave={handleSaveForklift}
      />
      
      <ForkliftDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        forklift={selectedForklift || undefined}
        onSave={handleSaveForklift}
      />
      
      {/* Forklift Details Dialog */}
      <ForkliftDetails
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        forklift={selectedForklift}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
};

export default ForkliftsPage;
