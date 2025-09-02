
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServiceOrdersPage from "./pages/ServiceOrders";
import QueuePage from "./pages/Queue";
import ReportsPage from "./pages/Reports";
import PrintPage from "./pages/Print";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full">
                    <header className="fixed top-0 left-0 z-50 h-12 flex items-center border-b bg-background">
                      <SidebarTrigger className="ml-2" />
                    </header>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/service-orders" element={<ServiceOrdersPage />} />
                      <Route path="/queue" element={<QueuePage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/print" element={<PrintPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
