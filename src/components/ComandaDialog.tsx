import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useComanda } from "@/contexts/ComandaContext";
import { toast } from "@/hooks/use-toast";
import { User, ShoppingCart, CheckCircle } from "lucide-react";

interface ComandaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComandaCriada: () => void;
}

const ComandaDialog = ({ open, onOpenChange, onComandaCriada }: ComandaDialogProps) => {
  const { criarComanda, comandaAtual } = useComanda();
  const [nomeCliente, setNomeCliente] = useState("");
  const [step, setStep] = useState<"nome" | "confirmacao">("nome");

  const handleCriarComanda = () => {
    if (!nomeCliente.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo.",
        variant: "destructive",
      });
      return;
    }

    if (nomeCliente.trim().split(" ").length < 2) {
      toast({
        title: "Nome completo necessário",
        description: "Por favor, informe seu nome completo (nome e sobrenome).",
        variant: "destructive",
      });
      return;
    }

    setStep("confirmacao");
  };

  const handleConfirmar = () => {
    criarComanda(nomeCliente.trim());
    toast({
      title: "Comanda criada!",
      description: `Comanda criada para ${nomeCliente.trim()}. Agora você pode adicionar itens ao cardápio.`,
    });
    setNomeCliente("");
    setStep("nome");
    onComandaCriada();
    onOpenChange(false);
  };

  const handleCancelar = () => {
    setNomeCliente("");
    setStep("nome");
    onOpenChange(false);
  };

  // Se já existe uma comanda aberta, mostrar mensagem diferente
  if (comandaAtual && step === "nome") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Comanda Já Aberta
            </DialogTitle>
            <DialogDescription>
              Você já possui uma comanda aberta. Deseja continuar com a comanda atual ou criar uma nova?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Comanda #{comandaAtual.numero}</p>
              <p className="text-sm text-muted-foreground">Cliente: {comandaAtual.nomeCliente}</p>
              <p className="text-sm text-muted-foreground">
                Itens: {comandaAtual.items.length}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelar}>
              Cancelar
            </Button>
            <Button onClick={onComandaCriada}>
              Continuar com Comanda Atual
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "confirmacao") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Confirmar Abertura de Comanda
            </DialogTitle>
            <DialogDescription>
              Confirme os detalhes antes de abrir a comanda de consumo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
              <p className="text-sm font-medium mb-2">Ao abrir uma comanda de consumo, você poderá:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Solicitar produtos diretamente do cardápio</li>
                <li>Adicionar itens à sua comanda conforme consumir</li>
                <li>Visualizar o total acumulado em tempo real</li>
                <li>Pagar ao final pelo que foi consumido</li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-1">Nome do Cliente:</p>
              <p className="text-lg font-semibold">{nomeCliente}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Importante:</strong> Após adicionar itens à comanda e confirmá-los, eles não poderão ser removidos. 
                Certifique-se de que está selecionando os itens corretos.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStep("nome")}>
              Voltar
            </Button>
            <Button onClick={handleConfirmar}>
              Confirmar e Abrir Comanda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informe seu Nome
          </DialogTitle>
          <DialogDescription>
            Para abrir uma comanda de consumo, precisamos do seu nome completo.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="nome-cliente">Nome Completo *</Label>
            <Input
              id="nome-cliente"
              placeholder="Ex: João Silva"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCriarComanda();
                }
              }}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Este nome será usado para identificação da sua comanda pelo garçom.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancelar}>
            Cancelar
          </Button>
          <Button onClick={handleCriarComanda}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComandaDialog;

