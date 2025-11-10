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
import { Label } from "@/components/ui/label";
import { Plus, Minus, Check } from "lucide-react";

interface ConfirmarItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  itemPrice: string;
  itemImage?: string;
  onConfirm: (quantity: number) => void;
}

const ConfirmarItemDialog = ({
  open,
  onOpenChange,
  itemName,
  itemPrice,
  itemImage,
  onConfirm,
}: ConfirmarItemDialogProps) => {
  const [quantity, setQuantity] = useState(1);

  const parsePrice = (price: string): number => {
    return parseFloat(price.replace("€", "").replace(",", ".").trim());
  };

  const total = parsePrice(itemPrice) * quantity;

  const handleConfirm = () => {
    onConfirm(quantity);
    setQuantity(1);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setQuantity(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirmar Adição à Comanda</DialogTitle>
          <DialogDescription>
            Revise os detalhes antes de adicionar este item à sua comanda.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Item Info */}
          <div className="flex gap-4">
            {itemImage && (
              <img
                src={itemImage}
                alt={itemName}
                className="w-24 h-24 rounded-md object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-1">{itemName}</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Preço unitário: {itemPrice}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="quantity" className="text-base font-medium">
                Quantidade
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Subtotal:</span>
                <span className="text-xl font-bold text-primary">
                  {total.toFixed(2)}€
                </span>
              </div>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-muted-foreground">
                  {quantity}x {itemPrice}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Lembrete:</strong> Após confirmar e adicionar este item à comanda, 
              ele poderá ser removido apenas antes da confirmação final dos itens.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className="gap-2">
            <Check className="h-4 w-4" />
            Confirmar e Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmarItemDialog;

