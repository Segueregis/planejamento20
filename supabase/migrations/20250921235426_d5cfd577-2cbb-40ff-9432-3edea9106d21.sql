-- Adicionar colunas necessárias para corresponder aos dados do Excel
ALTER TABLE public.ordens_servico 
ADD COLUMN IF NOT EXISTS numero_os_cliente TEXT,
ADD COLUMN IF NOT EXISTS denominacao_oficina TEXT,
ADD COLUMN IF NOT EXISTS ativo TEXT,
ADD COLUMN IF NOT EXISTS tipo_solicitacao_servico TEXT,
ADD COLUMN IF NOT EXISTS observacoes_avaliacao_servico TEXT,
ADD COLUMN IF NOT EXISTS denominacao_solicitante TEXT,
ADD COLUMN IF NOT EXISTS denominacao_unidade_negocio TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Aguardando Programação';

-- Habilitar Realtime para atualizações ao vivo
ALTER TABLE public.ordens_servico REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.ordens_servico;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ordens_servico_numero_os ON public.ordens_servico(numero_os);
CREATE INDEX IF NOT EXISTS idx_ordens_servico_status ON public.ordens_servico(status);
CREATE INDEX IF NOT EXISTS idx_ordens_servico_created_by ON public.ordens_servico(created_by);