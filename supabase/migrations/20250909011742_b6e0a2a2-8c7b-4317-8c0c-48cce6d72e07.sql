-- Inserir role admin para o usuário existente
INSERT INTO public.user_roles (user_id, role) 
VALUES ('3732ad0b-694c-4eb8-9d8b-d251f394217a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;