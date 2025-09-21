import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceOrderData {
  id: string;
  numero_os: string;
  os_cliente?: string;
  denominacao_os?: string;
  denominacao_ativo?: string;
  observacoes_servico?: string;
  solicitante?: string;
  unidade_negocio?: string;
  created_at: string;
  created_by: string;
  // New fields
  numero_os_cliente?: string;
  denominacao_oficina?: string;
  ativo?: string;
  tipo_solicitacao_servico?: string;
  observacoes_avaliacao_servico?: string;
  denominacao_solicitante?: string;
  denominacao_unidade_negocio?: string;
  status?: string;
}

export const useSupabaseRealtime = () => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchServiceOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ordens_servico')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setServiceOrders(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching service orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setServiceOrders([]);
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchServiceOrders();

    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ordens_servico',
          filter: `created_by=eq.${user.id}`
        },
        (payload) => {
          console.log('Realtime change:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setServiceOrders(prev => [payload.new as ServiceOrderData, ...prev]);
              break;
            case 'UPDATE':
              setServiceOrders(prev => 
                prev.map(order => 
                  order.id === payload.new.id ? payload.new as ServiceOrderData : order
                )
              );
              break;
            case 'DELETE':
              setServiceOrders(prev => 
                prev.filter(order => order.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const refreshData = () => {
    fetchServiceOrders();
  };

  return {
    serviceOrders,
    loading,
    error,
    refreshData
  };
};