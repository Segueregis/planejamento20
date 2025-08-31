-- Create usuarios table
CREATE TABLE public.usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  nome text NOT NULL,
  perfil text CHECK (perfil IN ('lider','técnico','supervisor','planejador','admin')),
  created_at timestamp DEFAULT now()
);

-- Create ordens_servico table
CREATE TABLE public.ordens_servico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_os text NOT NULL,
  os_cliente text,
  denominacao_os text,
  denominacao_ativo text,
  observacoes_servico text,
  solicitante text,
  unidade_negocio text,
  created_at timestamp DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for usuarios table
CREATE POLICY "Users can view their own profile"
ON public.usuarios
FOR SELECT
USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
ON public.usuarios
FOR UPDATE
USING (auth.uid()::text = id::text);

-- Create RLS policies for ordens_servico table
CREATE POLICY "Authenticated users can view ordens_servico"
ON public.ordens_servico
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert ordens_servico"
ON public.ordens_servico
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update ordens_servico"
ON public.ordens_servico
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete ordens_servico"
ON public.ordens_servico
FOR DELETE
TO authenticated
USING (true);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nome, perfil)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'nome', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'perfil', 'técnico')
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create usuario profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();