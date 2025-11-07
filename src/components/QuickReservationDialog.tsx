import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickReservationDialog = ({ open, onOpenChange }: QuickReservationDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.guests) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Pré-reserva realizada!",
      description: "Será redirecionado para completar os seus dados.",
    });

    // Redirecionar para página de reservas completa
    setTimeout(() => {
      window.location.href = `/reservas?date=${formData.date}&time=${formData.time}&guests=${formData.guests}`;
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Reserva Rápida de Mesa</DialogTitle>
          <DialogDescription>
            Escolha a data, hora e número de pessoas para a sua reserva.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hora
            </Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              min="12:00"
              max="23:00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Número de Pessoas
            </Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max="12"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              placeholder="Ex: 2"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              Continuar Reserva
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickReservationDialog;
