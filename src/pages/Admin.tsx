import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComandaDetalhesDialog from "@/components/ComandaDetalhesDialog";
import { useComanda } from "@/contexts/ComandaContext";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  ArrowLeft,
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Eye,
} from "lucide-react";
// Função simples de formatação de data (sem dependência externa)

const Admin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    comandas,
    getVendasDoDia,
    getTotalVendasDoDia,
    getComandasAbertas,
    getComandasFechadas,
    getComandasPagas,
  } = useComanda();

  const [comandaDetalhesId, setComandaDetalhesId] = useState<string | null>(null);
  const [showComandaDetalhes, setShowComandaDetalhes] = useState(false);

  const handleVerDetalhes = (comandaId: string) => {
    setComandaDetalhesId(comandaId);
    setShowComandaDetalhes(true);
  };

  const vendasDoDia = getVendasDoDia();
  const totalVendasDoDia = getTotalVendasDoDia();
  const comandasAbertas = getComandasAbertas();
  const comandasFechadas = getComandasFechadas();
  const comandasPagas = getComandasPagas();

  // Calcular estatísticas
  const totalItensVendidos = vendasDoDia.reduce((total, comanda) => {
    return total + comanda.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  const totalComandas = comandas.length;
  const taxaOcupacao = totalComandas > 0 
    ? ((comandasPagas.length / totalComandas) * 100).toFixed(1)
    : "0";

  // Estatísticas por forma de pagamento
  const vendasPorPagamento = vendasDoDia.reduce((acc, comanda) => {
    const forma = comanda.formaPagamento || "N/A";
    acc[forma] = (acc[forma] || 0) + comanda.total;
    return acc;
  }, {} as Record<string, number>);

  // Itens mais vendidos
  const itensMaisVendidos = vendasDoDia.reduce((acc, comanda) => {
    comanda.items.forEach((item) => {
      const key = item.name;
      if (!acc[key]) {
        acc[key] = { name: item.name, quantity: 0, total: 0 };
      }
      acc[key].quantity += item.quantity;
      acc[key].total += parseFloat(item.price.replace("€", "").replace(",", ".").trim()) * item.quantity;
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number; total: number }>);

  const itensMaisVendidosArray = Object.values(itensMaisVendidos)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  const formatarData = (data: Date) => {
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();
    const horas = data.getHours().toString().padStart(2, "0");
    const minutos = data.getMinutes().toString().padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-8">
              <Link
                to="/"
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao início
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                    Painel de Administração
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Gerencie vendas, estatísticas e configurações do sistema
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate("/painel")}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Painel de Comandas
                </Button>
              </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vendas do Dia</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalVendasDoDia.toFixed(2)}€</div>
                  <p className="text-xs text-muted-foreground">
                    {vendasDoDia.length} comanda(s) paga(s)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Itens Vendidos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalItensVendidos}</div>
                  <p className="text-xs text-muted-foreground">
                    Total de itens vendidos hoje
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comandas Abertas</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{comandasAbertas.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {comandasFechadas.length} fechada(s) aguardando pagamento
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taxaOcupacao}%</div>
                  <p className="text-xs text-muted-foreground">
                    Comandas pagas / Total
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs de Informações */}
            <Tabs defaultValue="vendas" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl">
                <TabsTrigger value="vendas">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Vendas
                </TabsTrigger>
                <TabsTrigger value="itens">
                  <Package className="mr-2 h-4 w-4" />
                  Itens Mais Vendidos
                </TabsTrigger>
                <TabsTrigger value="pagamentos">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Formas de Pagamento
                </TabsTrigger>
              </TabsList>

              {/* Vendas do Dia */}
              <TabsContent value="vendas" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendas do Dia</CardTitle>
                    <CardDescription>
                      Lista de todas as comandas pagas hoje
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {vendasDoDia.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhuma venda registrada hoje
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {vendasDoDia.map((comanda) => (
                          <div
                            key={comanda.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">Comanda #{comanda.numero}</h3>
                                <span className="text-sm text-muted-foreground">
                                  {comanda.nomeCliente}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                <span>{formatarData(comanda.dataPagamento || comanda.dataFechamento!)}</span>
                                <span className="mx-2">•</span>
                                <span>{comanda.items.length} item(ns)</span>
                                <span className="mx-2">•</span>
                                <span className="capitalize">{comanda.formaPagamento}</span>
                              </div>
                              {comanda.observacoes && (
                                <div className="text-sm text-muted-foreground italic line-clamp-1">
                                  "{comanda.observacoes}"
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 ml-4">
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">
                                  {comanda.total.toFixed(2)}€
                                </div>
                              </div>
                              <Button
                                onClick={() => handleVerDetalhes(comanda.id)}
                                variant="outline"
                                size="sm"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Detalhes
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Itens Mais Vendidos */}
              <TabsContent value="itens" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Itens Mais Vendidos</CardTitle>
                    <CardDescription>
                      Top 10 itens mais vendidos hoje
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {itensMaisVendidosArray.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum item vendido hoje
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {itensMaisVendidosArray.map((item, index) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-muted-foreground w-6">
                                #{index + 1}
                              </span>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {item.quantity} unidade(s)
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{item.total.toFixed(2)}€</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Formas de Pagamento */}
              <TabsContent value="pagamentos" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Vendas por Forma de Pagamento</CardTitle>
                    <CardDescription>
                      Distribuição de vendas por método de pagamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(vendasPorPagamento).length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhuma venda registrada hoje
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(vendasPorPagamento).map(([forma, total]) => (
                          <div
                            key={forma}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="font-medium capitalize">{forma}</div>
                            <div className="text-lg font-bold text-primary">
                              {total.toFixed(2)}€
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Seção de Gerenciamento (placeholder para futuras funcionalidades) */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Gerenciamento de Itens
                </CardTitle>
                <CardDescription>
                  Adicionar, editar ou remover itens do menu e catálogo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Funcionalidade em desenvolvimento. Em breve você poderá gerenciar os itens do menu e catálogo aqui.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Dialog de Detalhes da Comanda */}
        <ComandaDetalhesDialog
          comandaId={comandaDetalhesId}
          open={showComandaDetalhes}
          onOpenChange={setShowComandaDetalhes}
        />

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Admin;

