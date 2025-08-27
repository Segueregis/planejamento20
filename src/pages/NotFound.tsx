
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Erro: Usuário tentou acessar uma rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-6">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl text-foreground mb-6">Página não encontrada</p>
        <p className="text-muted-foreground mb-8">
          A página "{location.pathname}" que você está tentando acessar não existe ou foi movida.
        </p>
        <Button asChild className="gap-2">
          <Link to="/">
            <Home className="w-4 h-4" />
            Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
