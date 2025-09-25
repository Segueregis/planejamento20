import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExcelServiceOrder {
  numero_os: string;
  numero_os_cliente?: string;
  denominacao_os?: string;
  tipo_solicitacao_servico?: string;
  denominacao_oficina?: string;
  ativo?: string;
  denominacao_ativo?: string;
  observacoes_avaliacao_servico?: string;
  denominacao_solicitante?: string;
  denominacao_unidade_negocio?: string;
  status?: string;
}

serve(async (req) => {
  console.log('Function invoked:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized: missing Authorization header' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get request body and authenticated user
    const body = await req.json();
    const excelData = body?.excelData || body?.data;
    if (!excelData || !Array.isArray(excelData)) {
      throw new Error('Invalid Excel data format');
    }

    const { data: userResp, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userResp?.user) {
      console.error('Auth error or missing user', userErr);
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized: invalid or expired session' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });
    }
    const userId = userResp.user.id;
    console.log('Received data:', { excelDataLength: excelData?.length, userId });

    // Transform Excel data to match database structure
    const transformedData: any[] = excelData.map((row: ExcelServiceOrder) => ({
      numero_os: String((row as any).numero_os ?? '').trim(),
      numero_os_cliente: row.numero_os_cliente || '',
      denominacao_os: row.denominacao_os || '',
      tipo_solicitacao_servico: row.tipo_solicitacao_servico || '',
      denominacao_oficina: row.denominacao_oficina || '',
      ativo: row.ativo || '',
      denominacao_ativo: row.denominacao_ativo || '',
      observacoes_avaliacao_servico: row.observacoes_avaliacao_servico || '',
      denominacao_solicitante: row.denominacao_solicitante || '',
      denominacao_unidade_negocio: row.denominacao_unidade_negocio || '',
      status: row.status || 'Aguardando Programação',
      created_by: userId,
      // Map to existing fields for compatibility
      os_cliente: row.numero_os_cliente || '',
      solicitante: row.denominacao_solicitante || '',
      unidade_negocio: row.denominacao_unidade_negocio || '',
      observacoes_servico: row.observacoes_avaliacao_servico || ''
    }));

    console.log('Transformed data sample:', transformedData[0]);

    // Get existing service orders for this user
    const { data: existingOrders, error: fetchError } = await supabase
      .from('ordens_servico')
      .select('numero_os')
      .eq('created_by', userId);

    if (fetchError) {
      console.error('Error fetching existing orders:', fetchError);
      throw new Error(`Failed to fetch existing orders: ${fetchError.message}`);
    }

    const existingNumbersOS = existingOrders?.map(order => order.numero_os) || [];
    const newNumbersOS = transformedData.map(order => order.numero_os);

    console.log('Existing OS numbers:', existingNumbersOS.length);
    console.log('New OS numbers:', newNumbersOS.length);

    // Delete orders that are not in the Excel file
    const ordersToDelete = existingNumbersOS.filter(numeroOS => !newNumbersOS.includes(numeroOS));
    
    if (ordersToDelete.length > 0) {
      console.log('Deleting orders:', ordersToDelete);
      const { error: deleteError } = await supabase
        .from('ordens_servico')
        .delete()
        .eq('created_by', userId)
        .in('numero_os', ordersToDelete);

      if (deleteError) {
        console.error('Error deleting orders:', deleteError);
        throw new Error(`Failed to delete orders: ${deleteError.message}`);
      }
    }

    // Upsert (insert or update) new orders
    const { data: upsertedData, error: upsertError } = await supabase
      .from('ordens_servico')
      .upsert(transformedData, {
        onConflict: 'numero_os,created_by',
        ignoreDuplicates: false
      })
      .select();

    if (upsertError) {
      console.error('Error upserting orders:', upsertError);
      throw new Error(`Failed to sync orders: ${upsertError.message}`);
    }

    console.log('Successfully synced orders:', upsertedData?.length);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully synced ${upsertedData?.length || 0} service orders`,
        stats: {
          total: transformedData.length,
          deleted: ordersToDelete.length,
          upserted: upsertedData?.length || 0
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (err) {
    console.error('Function error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({
        success: false,
        error: message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});