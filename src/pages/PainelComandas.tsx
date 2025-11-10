import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComandaDialog from "@/components/ComandaDialog";
import { useComanda, FormaPagamento } from "@/contexts/ComandaContext";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  Clock,
  Euro,
  Calendar,
  CreditCard,
  DollarSign,
  Smartphone,
  Printer,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const PainelComandas = () => {
  const navigate = useNavigate();
  const {
    comandas,
    comandaAtual,
    selecionarComanda,
    getComandasAbertas,
    getComandasFechadas,
    getVendasDoDia,
    getTotalVendasDoDia,
    getTotalFormatado,
    marcarComoPaga,
  } = useComanda();

  const [comandaDialogOpen, setComandaDialogOpen] = useState(false);

  const [selectedComanda, setSelectedComanda] = useState<string | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("");

  const comandasAbertas = getComandasAbertas();
  const comandasFechadas = getComandasFechadas();
  const vendasDoDia = getVendasDoDia();
  const totalVendasDoDia = getTotalVendasDoDia();

  const formasPagamento: { value: FormaPagamento; label: string; icon: any }[] = [
    { value: "dinheiro", label: "Dinheiro", icon: DollarSign },
    { value: "cartao", label: "Cartão", icon: CreditCard },
    { value: "multibanco", label: "Multibanco", icon: Printer },
    { value: "mbway", label: "MB Way", icon: Smartphone },
  ];

  const handleAbrirComanda = (comandaId: string) => {
    selecionarComanda(comandaId);
    navigate("/pedidos");
  };

  const handleNovaComanda = () => {
    setComandaDialogOpen(true);
  };

  const handleComandaCriada = () => {
    setComandaDialogOpen(false);
    navigate("/pedidos");
  };

  const handleMarcarComoPaga = (comandaId: string) => {
    setSelectedComanda(comandaId);
    setShowPaymentDialog(true);
  };

  const handleConfirmarPagamento = () => {
    if (!selectedComanda || !formaPagamento) {
      toast({
        title: "Forma de pagamento obrigatória",
        description: "Selecione a forma de pagamento antes de confirmar.",
        variant: "destructive",
      });
      return;
    }

    marcarComoPaga(selectedComanda, formaPagamento);
    toast({
      title: "Comanda marcada como paga!",
      description: `Comanda foi marcada como paga via ${formatarFormaPagamento(formaPagamento)}.`,
    });

    setShowPaymentDialog(false);
    setFormaPagamento("");
    setSelectedComanda(null);
  };

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(data);
  };

  const formatarFormaPagamento = (forma?: FormaPagamento) => {
    if (!forma) return "N/A";
    const formaObj = formasPagamento.find((f) => f.value === forma);
    return formaObj ? formaObj.label : forma;
  };

  const comandaSelecionada = selectedComanda
    ? comandas.find((c) => c.id === selectedComanda)
    : null;

  return (
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
                  Painel de Comandas
                </h1>
                <p className="text-lg text-muted-foreground">
                  Gerencie comandas abertas, fechadas e histórico de vendas
                </p>
              </div>
              <Button onClick={handleNovaComanda} size="lg">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Nova Comanda
              </Button>
            </div>
          </div>

          {/* Resumo do Dia */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Resumo do Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Comandas Abertas</p>
                    <p className="text-2xl font-bold">{comandasAbertas.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Comandas Fechadas</p>
                    <p className="text-2xl font-bold">{comandasFechadas.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Comandas Pagas</p>
                    <p className="text-2xl font-bold">{vendasDoDia.length}</p>
                  </div>
                  <Euro className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Vendas</p>
                    <p className="text-2xl font-bold text-primary">
                      {totalVendasDoDia.toFixed(2)}€
                    </p>
                  </div>
                  <Euro className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de Comandas */}
          <Tabs defaultValue="abertas" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl">
              <TabsTrigger value="abertas">
                Abertas ({comandasAbertas.length})
              </TabsTrigger>
              <TabsTrigger value="fechadas">
                Fechadas ({comandasFechadas.length})
              </TabsTrigger>
              <TabsTrigger value="historico">
                Histórico ({vendasDoDia.length})
              </TabsTrigger>
            </TabsList>

            {/* Comandas Abertas */}
            <TabsContent value="abertas" className="space-y-4 mt-6">
              {comandasAbertas.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhuma comanda aberta</h3>
                    <p className="text-muted-foreground mb-4">
                      Crie uma nova comanda para começar
                    </p>
                    <Button onClick={handleNovaComanda}>
                      Criar Nova Comanda
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comandasAbertas.map((comanda) => (
                    <Card key={comanda.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Comanda #{comanda.numero}</CardTitle>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Aberta
                          </Badge>
                        </div>
                        <CardDescription>
                          Aberta em {formatarData(comanda.dataAbertura)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                          <p className="font-semibold">{comanda.nomeCliente}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Itens</p>
                          <p className="text-2xl font-bold">{comanda.items.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total</p>
                          <p className="text-2xl font-bold text-primary">
                            {getTotalFormatado(comanda.id)}
                          </p>
                        </div>
                        <Separator />
                        <Button
                          onClick={() => handleAbrirComanda(comanda.id)}
                          className="w-full"
                          variant="default"
                        >
                          Abrir Comanda
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Comandas Fechadas */}
            <TabsContent value="fechadas" className="space-y-4 mt-6">
              {comandasFechadas.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhuma comanda fechada</h3>
                    <p className="text-muted-foreground">
                      As comandas fechadas aparecerão aqui
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {comandasFechadas.map((comanda) => (
                    <Card key={comanda.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Comanda #{comanda.numero}</CardTitle>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Fechada
                          </Badge>
                        </div>
                        <CardDescription>
                          Fechada em {formatarData(comanda.dataFechamento!)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                          <p className="font-semibold">{comanda.nomeCliente}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Forma de Pagamento</p>
                          <p className="font-semibold">
                            {formatarFormaPagamento(comanda.formaPagamento)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total</p>
                          <p className="text-2xl font-bold text-primary">
                            {getTotalFormatado(comanda.id)}
                          </p>
                        </div>
                        <Separator />
                        <Button
                          onClick={() => handleMarcarComoPaga(comanda.id)}
                          className="w-full"
                          variant="default"
                        >
                          Marcar como Paga
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Histórico de Vendas */}
            <TabsContent value="historico" className="space-y-4 mt-6">
              {vendasDoDia.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Euro className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhuma venda hoje</h3>
                    <p className="text-muted-foreground">
                      As comandas pagas aparecerão aqui
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {vendasDoDia.map((comanda) => {
                    const FormaIcon = formasPagamento.find(
                      (f) => f.value === comanda.formaPagamento
                    )?.icon || CreditCard;

                    return (
                      <Card key={comanda.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold">Comanda #{comanda.numero}</h3>
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                Paga
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Cliente</p>
                                <p className="font-medium">{comanda.nomeCliente}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Data/Hora</p>
                                <p className="font-medium">
                                  {formatarData(comanda.dataPagamento || comanda.dataFechamento!)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                                <div className="flex items-center gap-2">
                                  <FormaIcon className="h-4 w-4" />
                                  <p className="font-medium">
                                    {formatarFormaPagamento(comanda.formaPagamento)}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Itens</p>
                                <p className="font-medium">{comanda.items.length}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-xl font-bold text-primary">
                                  {getTotalFormatado(comanda.id)}
                                </p>
                              </div>
                            </div>
                              {comanda.observacoes && (
                                <div className="mt-4 p-3 bg-muted rounded-lg">
                                  <p className="text-sm text-muted-foreground">Observações</p>
                                  <p className="text-sm">{comanda.observacoes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Dialog de Criação de Comanda */}
      <ComandaDialog
        open={comandaDialogOpen}
        onOpenChange={setComandaDialogOpen}
        onComandaCriada={handleComandaCriada}
      />

      {/* Dialog de Pagamento para Comandas Fechadas */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Marcar Comanda #{comandaSelecionada?.numero} como Paga
            </DialogTitle>
            <DialogDescription>
              Confirme a forma de pagamento para marcar a comanda como paga.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {comandaSelecionada && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {getTotalFormatado(comandaSelecionada.id)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="forma-pagamento-painel">Forma de Pagamento *</Label>
              <Select
                value={formaPagamento}
                onValueChange={(value) => setFormaPagamento(value as FormaPagamento)}
              >
                <SelectTrigger id="forma-pagamento-painel">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {formasPagamento.map((forma) => (
                    <SelectItem key={forma.value} value={forma.value}>
                      <div className="flex items-center gap-2">
                        <forma.icon className="h-4 w-4" />
                        {forma.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarPagamento} disabled={!formaPagamento}>
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PainelComandas;

