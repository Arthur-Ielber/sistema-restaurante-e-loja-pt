import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ComandaProvider } from "@/contexts/ComandaContext";
import Index from "./pages/Index";
import Catalogo from "./pages/Catalogo";
import Reservas from "./pages/Reservas";
import Pedidos from "./pages/Pedidos";
import PainelComandas from "./pages/PainelComandas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ComandaProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/painel" element={<PainelComandas />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ComandaProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
