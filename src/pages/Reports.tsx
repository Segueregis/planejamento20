
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, FileBarChart, Filter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const ReportsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className={cn(
        "flex-1 flex flex-col",
        !isMobile && "ml-64" // Offset for sidebar when not mobile
      )}>
        <Navbar 
          title="Relatórios" 
          subtitle="Visualização e exportação de dados"
        />
        
        <main className="flex-1 px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Relatórios do Sistema</h1>
            
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtros</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Período</h3>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Tipos de Relatório</h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 p-0">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Toggle</span>
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="operations" />
                        <label htmlFor="operations" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Operações
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="maintenance" />
                        <label htmlFor="maintenance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Manutenções
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="gas" />
                        <label htmlFor="gas" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Abastecimento
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="operator" />
                        <label htmlFor="operator" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Operadores
                        </label>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Relatórios Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Report Cards */}
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="p-4 flex gap-4 items-center">
                        <div className="p-2 bg-primary/10 text-primary rounded-md">
                          <FileBarChart className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">Utilização de Empilhadeiras</h3>
                          <p className="text-sm text-muted-foreground">Análise de horas de uso por máquina</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="p-4 flex gap-4 items-center">
                        <div className="p-2 bg-primary/10 text-primary rounded-md">
                          <FileBarChart className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">Consumo de Combustível</h3>
                          <p className="text-sm text-muted-foreground">Consumo de gás por empilhadeira e horímetro</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="p-4 flex gap-4 items-center">
                        <div className="p-2 bg-primary/10 text-primary rounded-md">
                          <FileBarChart className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">Histórico de Manutenções</h3>
                          <p className="text-sm text-muted-foreground">Registros de manutenções realizadas</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="hover:bg-muted/50 cursor-pointer transition-colors">
                      <CardContent className="p-4 flex gap-4 items-center">
                        <div className="p-2 bg-primary/10 text-primary rounded-md">
                          <FileBarChart className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">Status dos Operadores</h3>
                          <p className="text-sm text-muted-foreground">Validade de ASO e certificações</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-8 text-center text-muted-foreground">
                    <p>Selecione um relatório para visualizar ou exportar</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
