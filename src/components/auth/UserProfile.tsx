import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const UserProfile: React.FC = () => {
  const { userProfile, signOut, hasRole } = useAuth();

  if (!userProfile) {
    return null;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'lider':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'tecnico':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'operador':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          Perfil do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium">{userProfile.nome}</p>
          <p className="text-xs text-muted-foreground">{userProfile.email}</p>
        </div>
        
        <div>
          <p className="text-xs font-medium mb-2">Roles:</p>
          <div className="flex flex-wrap gap-1">
            {userProfile.roles?.map((role) => (
              <Badge
                key={role}
                variant="secondary"
                className={`text-xs ${getRoleColor(role)}`}
              >
                {role}
              </Badge>
            )) || (
              <Badge variant="outline" className="text-xs">
                Nenhuma role
              </Badge>
            )}
          </div>
        </div>

        {/* Demonstração do sistema de roles */}
        <div className="space-y-1 text-xs">
          <p className="font-medium">Permissões:</p>
          <ul className="space-y-1 text-muted-foreground">
            {hasRole('admin') && <li>✅ Administrador total</li>}
            {hasRole('lider') && <li>✅ Gerenciar equipe</li>}
            {hasRole('tecnico') && <li>✅ Executar serviços</li>}
            {hasRole('operador') && <li>✅ Visualizar dados</li>}
          </ul>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="w-full mt-3"
        >
          <LogOut className="h-3 w-3 mr-2" />
          Sair
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;