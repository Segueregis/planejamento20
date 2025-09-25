-- Ensure upsert on ordens_servico works by adding a unique constraint matching the ON CONFLICT target
ALTER TABLE public.ordens_servico
ADD CONSTRAINT ordens_servico_numero_os_created_by_unique UNIQUE (numero_os, created_by);