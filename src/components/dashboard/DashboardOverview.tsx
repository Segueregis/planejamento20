
import React from 'react';
import StatusCard from './StatusCard';
import { 
  Truck, Users, AlertTriangle, CheckCircle, 
  Clock, Fuel, Settings, Calendar
} from 'lucide-react';
import { DashboardStats } from '@/types';

// Mock data for initial rendering
const initialStats: DashboardStats = {
  totalServiceOrders: 45,
  waitingSchedule: 12,
  inProgress: 8,
  scheduled: 15,
  priority: 5,
  waitingPhotoEmail: 3,
  waitingMaterial: 2,
  totalTechnicians: 18,
  availableTechnicians: 14,
  busyTechnicians: 3,
  techniciansOnMaintenance: 1
};

interface DashboardOverviewProps {
  stats?: DashboardStats;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  stats = initialStats 
}) => {
  return (
    <section className="space-y-6">
      <div className="slide-enter" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-2xl font-semibold mb-4">Status das Ordens de Serviço</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total de OS" 
            value={stats.totalServiceOrders} 
            icon={Truck} 
            status="info" 
          />
          <StatusCard 
            title="Aguardando Programação" 
            value={stats.waitingSchedule} 
            icon={Clock} 
            status="warning"
            change={{ value: 8, trend: 'up' }}
          />
          <StatusCard 
            title="Em Andamento" 
            value={stats.inProgress} 
            icon={CheckCircle} 
            status="success" 
          />
          <StatusCard 
            title="Programado" 
            value={stats.scheduled} 
            icon={Calendar} 
            status="info" 
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <StatusCard 
            title="Prioridade" 
            value={stats.priority} 
            icon={AlertTriangle} 
            status="danger" 
          />
          <StatusCard 
            title="Foto Email" 
            value={stats.waitingPhotoEmail} 
            icon={Settings} 
            status="neutral" 
          />
          <StatusCard 
            title="Aguardando Material" 
            value={stats.waitingMaterial} 
            icon={Fuel} 
            status="warning" 
          />
        </div>
      </div>

      <div className="slide-enter" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-2xl font-semibold mb-4">Status dos Técnicos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Total de Técnicos" 
            value={stats.totalTechnicians} 
            icon={Users} 
            status="info" 
          />
          <StatusCard 
            title="Disponíveis" 
            value={stats.availableTechnicians} 
            icon={CheckCircle} 
            status="success" 
          />
          <StatusCard 
            title="Ocupados" 
            value={stats.busyTechnicians} 
            icon={Clock} 
            status="warning" 
          />
          <StatusCard 
            title="Em Manutenção" 
            value={stats.techniciansOnMaintenance} 
            icon={Settings} 
            status="neutral" 
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardOverview;
