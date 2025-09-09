-- Security fixes for the application

-- 1. Add created_by column to ordens_servico for user ownership tracking
ALTER TABLE public.ordens_servico 
ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Create trigger to automatically set created_by on insert
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_ordens_servico_created_by
  BEFORE INSERT ON public.ordens_servico
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();

-- 3. Update existing records to have proper ownership (set to first admin user)
UPDATE public.ordens_servico 
SET created_by = '3732ad0b-694c-4eb8-9d8b-d251f394217a'
WHERE created_by IS NULL;

-- 4. Make created_by NOT NULL after setting values
ALTER TABLE public.ordens_servico 
ALTER COLUMN created_by SET NOT NULL;

-- 5. Drop the overly permissive policies on ordens_servico
DROP POLICY IF EXISTS "Authenticated users can view ordens_servico" ON public.ordens_servico;
DROP POLICY IF EXISTS "Authenticated users can insert ordens_servico" ON public.ordens_servico;
DROP POLICY IF EXISTS "Authenticated users can update ordens_servico" ON public.ordens_servico;
DROP POLICY IF EXISTS "Authenticated users can delete ordens_servico" ON public.ordens_servico;

-- 6. Create secure, user-specific RLS policies for ordens_servico
CREATE POLICY "Users can view their own service orders" 
ON public.ordens_servico 
FOR SELECT 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own service orders" 
ON public.ordens_servico 
FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own service orders" 
ON public.ordens_servico 
FOR UPDATE 
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete service orders" 
ON public.ordens_servico 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Harden user_roles policies with proper WITH CHECK clauses
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. Ensure usuarios policies are secure (users should only access their own profile)
-- The current policies are already secure, but let's make them explicit

DROP POLICY IF EXISTS "Users can view their own profile" ON public.usuarios;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.usuarios;  
DROP POLICY IF EXISTS "Users can update their own profile" ON public.usuarios;

CREATE POLICY "Users can view their own profile" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid() = id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own profile" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);