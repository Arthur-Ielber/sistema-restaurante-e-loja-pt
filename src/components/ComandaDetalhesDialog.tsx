import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useComanda, Comanda, FormaPagamento } from "@/contexts/ComandaContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Calendar, 
  ShoppingCart, 
  DollarSign, 
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface ComandaDetalhesDialogProps {
  comandaId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ComandaDetalhesDialog = ({
  comandaId,
  open,
  onOpenChange,
}: ComandaDetalhesDialogProps) => {
  const { comandas, getTotalFormatado } = useComanda();

  const comanda = comandaId
    ? comandas.find((c) => c.id === comandaId)
    : null;

  if (!comanda) return null;

  const formatarData = (data: Date) => {
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear();
    const horas = data.getHours().toString().padStart(2, "0");
    const minutos = data.getMinutes().toString().padStart(2, "0");
    return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
  };

  const formatarFormaPagamento = (forma?: FormaPagamento) => {
    if (!forma) return "N/A";
    const formas: Record<string, string> = {
      dinheiro: "Dinheiro",
      cartao: "Cartão",
      multibanco: "Multibanco",
      mbway: "MB Way",
    };
    return formas[forma] || forma;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aberta":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="mr-1 h-3 w-3" />
            Aberta
          </Badge>
        );
      case "fechada":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <XCircle className="mr-1 h-3 w-3" />
            Fechada
          </Badge>
        );
      case "paga":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paga
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const parsePrice = (price: string): number => {
    return parseFloat(price.replace("€", "").replace(",", ".").trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Comanda #{comanda.numero}
            </DialogTitle>
            {getStatusBadge(comanda.status)}
          </div>
          <DialogDescription>
            Detalhes completos da comanda
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Informações da Comanda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-semibold">{comanda.nomeCliente}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Abertura</p>
                  <p className="font-semibold">{formatarData(comanda.dataAbertura)}</p>
                </div>
              </div>

              {comanda.dataFechamento && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Fechamento</p>
                    <p className="font-semibold">{formatarData(comanda.dataFechamento)}</p>
                  </div>
                </div>
              )}

              {comanda.dataPagamento && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Pagamento</p>
                    <p className="font-semibold">{formatarData(comanda.dataPagamento)}</p>
                  </div>
                </div>
              )}

              {comanda.formaPagamento && (
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                    <p className="font-semibold">
                      {formatarFormaPagamento(comanda.formaPagamento)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Itens da Comanda */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Itens da Comanda</h3>
                <Badge variant="outline" className="ml-auto">
                  {comanda.items.length} item(ns)
                </Badge>
              </div>

              {comanda.items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum item adicionado à comanda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {comanda.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          {item.confirmed && (
                            <Badge variant="outline" className="text-xs">
                              Confirmado
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Quantidade: {item.quantity}x</span>
                          <span>•</span>
                          <span>Preço unitário: {item.price}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold text-lg">
                          {(parsePrice(item.price) * item.quantity).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <span className="text-lg font-semibold">Total da Comanda</span>
              <span className="text-2xl font-bold text-primary">
                {getTotalFormatado(comanda.id)}
              </span>
            </div>

            {/* Observações */}
            {comanda.observacoes && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Observações</h3>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{comanda.observacoes}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ComandaDetalhesDialog;

