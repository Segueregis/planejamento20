
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ForkliftCard from '@/components/forklift/ForkliftCard';
import { Forklift, ForkliftStatus, ForkliftType } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Mock data for the dashboard
const mockForklifts: Forklift[] = [
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
];

const Index = () => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState<string>('');
  
  useEffect(() => {
    // Set current date in Brazilian format
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(now.toLocaleDateString('pt-BR', options));
    
    // First letter uppercase
    setCurrentDate(prev => 
      prev.charAt(0).toUpperCase() + prev.slice(1)
    );
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64" // Offset for sidebar when not mobile
      )}>
        <Navbar 
          title="Dashboard" 
          subtitle={currentDate}
        />
        
        <main className="flex-1 px-6 py-6">
          <DashboardOverview />
          
          <section className="mt-8 slide-enter" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Empilhadeiras Em Destaque</h2>
              <button className="text-sm text-primary hover:underline">
                Ver todas
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockForklifts.map((forklift) => (
                <ForkliftCard 
                  key={forklift.id} 
                  forklift={forklift} 
                  onClick={() => console.log(`Clicked on ${forklift.id}`)}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
