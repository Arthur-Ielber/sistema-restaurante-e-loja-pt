import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComandaDialog from "@/components/ComandaDialog";
import { useComanda, FormaPagamento } from "@/contexts/ComandaContext";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Pedidos = () => {
  const navigate = useNavigate();
  const {
    comandaAtual,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    confirmarItens,
    fecharComanda,
    getTotalFormatado,
    getItemCount,
  } = useComanda();

  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [comandaDialogOpen, setComandaDialogOpen] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("");
  const [observacoes, setObservacoes] = useState("");
  const [jaPaga, setJaPaga] = useState<boolean>(true);
  const isNavigatingAwayRef = useRef(false);

  // Mostrar dialog de criação de comanda apenas quando o componente monta sem comanda
  // Não abrir quando uma comanda é fechada (vamos redirecionar para o painel)
  useEffect(() => {
    // Não fazer nada se estamos navegando para fora da página
    if (isNavigatingAwayRef.current) {
      return;
    }

    // Só abrir o dialog se não há comanda atual
    if (!comandaAtual) {
      const timer = setTimeout(() => {
        // Verificar novamente se não estamos navegando antes de abrir
        if (!isNavigatingAwayRef.current && !comandaAtual) {
          setComandaDialogOpen(true);
        }
      }, 200);
      return () => clearTimeout(timer);
    } else {
      // Se há comanda, garantir que o dialog está fechado
      setComandaDialogOpen(false);
    }
  }, [comandaAtual]);

  const itemsNaoConfirmados = comandaAtual?.items.filter((item) => !item.confirmed) || [];
  const itemsConfirmados = comandaAtual?.items.filter((item) => item.confirmed) || [];

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removerItem(id);
      toast({
        title: "Item removido",
        description: "O item foi removido do seu pedido.",
      });
    } else {
      atualizarQuantidade(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string, name: string) => {
    removerItem(id);
    toast({
      title: "Item removido",
      description: `${name} foi removido do seu pedido.`,
    });
  };

  const handleConfirmarItens = () => {
    if (itemsNaoConfirmados.length === 0) {
      toast({
        title: "Nenhum item para confirmar",
        description: "Adicione itens ao pedido antes de confirmar.",
        variant: "destructive",
      });
      return;
    }

    confirmarItens();
    toast({
      title: "Itens confirmados!",
      description: "Os itens foram adicionados à comanda e não podem mais ser removidos.",
    });
  };

  const handleAbrirDialogPagamento = () => {
    if (itemsConfirmados.length === 0 && itemsNaoConfirmados.length === 0) {
      toast({
        title: "Comanda vazia",
        description: "Adicione e confirme itens antes de fechar a comanda.",
        variant: "destructive",
      });
      return;
    }

    // Confirmar itens pendentes antes de fechar
    if (itemsNaoConfirmados.length > 0) {
      confirmarItens();
    }

    setShowPaymentDialog(true);
  };

  const handleFecharComanda = () => {
    // Se já está paga, forma de pagamento é obrigatória
    if (jaPaga && !formaPagamento) {
      toast({
        title: "Forma de pagamento obrigatória",
        description: "Selecione a forma de pagamento antes de finalizar.",
        variant: "destructive",
      });
      return;
    }

    // Marcar que estamos navegando para evitar que o dialog apareça
    isNavigatingAwayRef.current = true;
    
    // Fechar dialogs primeiro para evitar que o dialog de criação apareça
    setShowPaymentDialog(false);
    setComandaDialogOpen(false);

    // Armazenar o número da comanda antes de fechar (para o toast)
    const numeroComanda = comandaAtual?.numero;

    // Fechar a comanda
    fecharComanda(formaPagamento || "dinheiro", observacoes || undefined, jaPaga);
    
    // Limpar estados
    setFormaPagamento("");
    setObservacoes("");
    setJaPaga(true);
    
    // Mostrar toast
    if (jaPaga) {
      toast({
        title: "Comanda fechada e paga!",
        description: `Comanda #${numeroComanda} foi fechada e paga via ${formaPagamento}.`,
      });
    } else {
      toast({
        title: "Comanda fechada!",
        description: `Comanda #${numeroComanda} foi fechada. O pagamento será processado posteriormente.`,
      });
    }

    // Redirecionar para o painel imediatamente
    navigate("/painel", { replace: true });
  };

  const formasPagamento: { value: FormaPagamento; label: string }[] = [
    { value: "dinheiro", label: "Dinheiro" },
    { value: "cartao", label: "Cartão" },
    { value: "multibanco", label: "Multibanco" },
    { value: "mbway", label: "MB Way" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao início
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  Comanda #{comandaAtual?.numero || "Nova"}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {comandaAtual?.nomeCliente && `Cliente: ${comandaAtual.nomeCliente}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {comandaAtual?.status === "aberta" ? "Comanda aberta" : "Comanda fechada"}
                </p>
              </div>
              <Link to="/painel">
                <Button variant="outline">
                  Ver Painel
                </Button>
              </Link>
            </div>
          </div>

          {(!comandaAtual || getItemCount() === 0) ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Comanda vazia</h3>
                <p className="text-muted-foreground mb-6">
                  Adicione itens do menu à sua comanda
                </p>
                <Link to="/">
                  <Button variant="default" size="lg">
                    Ver Menu
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de Itens */}
              <div className="lg:col-span-2 space-y-6">
                {/* Itens Não Confirmados */}
                {itemsNaoConfirmados.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold">
                        Itens Pendentes ({itemsNaoConfirmados.length})
                      </h2>
                      <Button
                        onClick={handleConfirmarItens}
                        size="sm"
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Confirmar Itens
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {itemsNaoConfirmados.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {item.description}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                                    onClick={() => handleRemoveItem(item.id, item.name)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                
                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-12 text-center font-semibold">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Preço unitário</p>
                                    <p className="font-bold text-primary text-lg">{item.price}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Subtotal: {(parseFloat(item.price.replace("€", "").replace(",", ".").trim()) * item.quantity).toFixed(2)}€
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Itens Confirmados */}
                {itemsConfirmados.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">
                      Itens Confirmados ({itemsConfirmados.length})
                    </h2>
                    <div className="space-y-4">
                      {itemsConfirmados.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-primary/20">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                        Confirmado
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Quantidade:</span>
                                    <span className="font-semibold">{item.quantity}x</span>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Preço unitário</p>
                                    <p className="font-bold text-primary text-lg">{item.price}</p>
                                    <p className="text-sm font-semibold mt-1">
                                      Subtotal: {(parseFloat(item.price.replace("€", "").replace(",", ".").trim()) * item.quantity).toFixed(2)}€
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Resumo da Comanda */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-2xl">Resumo da Comanda</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Comanda #</span>
                        <span className="font-medium">{comandaAtual?.numero}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium capitalize">{comandaAtual?.status}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm text-muted-foreground">Itens</h3>
                      {comandaAtual?.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.name} x{item.quantity}
                            {item.confirmed && (
                              <span className="ml-2 text-xs text-primary">✓</span>
                            )}
                          </span>
                          <span className="font-medium">
                            {(parseFloat(item.price.replace("€", "").replace(",", ".").trim()) * item.quantity).toFixed(2)}€
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-base">
                        <span className="font-semibold">Total de itens:</span>
                        <span className="font-semibold">{getItemCount()}</span>
                      </div>
                      <div className="flex justify-between text-xl pt-2 border-t">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-primary">{getTotalFormatado()}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 pt-2">
                      {itemsNaoConfirmados.length > 0 && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            Você tem {itemsNaoConfirmados.length} item(ns) pendente(s) de confirmação.
                          </p>
                        </div>
                      )}
                      <Button
                        onClick={handleAbrirDialogPagamento}
                        className="w-full"
                        size="lg"
                        disabled={getItemCount() === 0}
                      >
                        Fechar e Pagar Comanda
                      </Button>
                      <Link to="/" className="block">
                        <Button variant="outline" className="w-full" size="lg">
                          Continuar Adicionando
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Dialog de Criação de Comanda */}
      <ComandaDialog
        open={comandaDialogOpen}
        onOpenChange={setComandaDialogOpen}
        onComandaCriada={() => setComandaDialogOpen(false)}
      />

      {/* Dialog de Pagamento */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fechar Comanda #{comandaAtual?.numero}</DialogTitle>
            <DialogDescription>
              Confirme se a conta já está com o pagamento correto e fechado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total a pagar:</span>
                <span className="text-2xl font-bold text-primary">{getTotalFormatado()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">A conta já está paga?</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={jaPaga ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setJaPaga(true)}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Sim, já está paga
                </Button>
                <Button
                  type="button"
                  variant={!jaPaga ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setJaPaga(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Não, fechar sem pagar
                </Button>
              </div>
            </div>

            {jaPaga && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="forma-pagamento">Forma de Pagamento *</Label>
                  <Select
                    value={formaPagamento}
                    onValueChange={(value) => setFormaPagamento(value as FormaPagamento)}
                  >
                    <SelectTrigger id="forma-pagamento">
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {formasPagamento.map((forma) => (
                        <SelectItem key={forma.value} value={forma.value}>
                          {forma.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                placeholder="Adicione observações sobre o pagamento..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPaymentDialog(false);
              setJaPaga(true);
              setFormaPagamento("");
            }}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button 
              onClick={handleFecharComanda} 
              disabled={jaPaga && !formaPagamento}
            >
              <Check className="mr-2 h-4 w-4" />
              {jaPaga ? "Confirmar Pagamento" : "Fechar Comanda"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Pedidos;
