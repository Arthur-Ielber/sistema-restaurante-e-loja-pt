import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import dishBacalhau from "@/assets/dish-bacalhau.jpg";
import dishCataplana from "@/assets/dish-cataplana.jpg";
import dishPastelNata from "@/assets/dish-pastelnata.jpg";

interface MenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MenuDialog = ({ open, onOpenChange }: MenuDialogProps) => {
  const menuSections = {
    entradas: [
      { name: "Pataniscas de Bacalhau", price: "8.50€", description: "Bolinhos de bacalhau crocantes" },
      { name: "Queijo da Serra com Doce", price: "9.00€", description: "Queijo artesanal com doce de abóbora" },
      { name: "Presunto Ibérico", price: "12.00€", description: "Fatias finas de presunto curado" },
      { name: "Ameijoas à Bulhão Pato", price: "11.50€", description: "Ameijoas frescas com alho e coentros" },
    ],
    principais: [
      { name: "Bacalhau à Brás", price: "16.50€", description: "Bacalhau desfiado com batata palha e ovos", image: dishBacalhau },
      { name: "Cataplana de Marisco", price: "24.00€", description: "Marisco fresco na tradicional cataplana", image: dishCataplana },
      { name: "Polvo à Lagareiro", price: "22.00€", description: "Polvo grelhado com batatas a murro" },
      { name: "Arroz de Pato", price: "18.50€", description: "Arroz cremoso com pato desfiado" },
      { name: "Bife à Café", price: "19.00€", description: "Lombo de vaca com molho de café" },
    ],
    sobremesas: [
      { name: "Pastel de Nata", price: "2.50€", description: "Tradicional pastel de Belém", image: dishPastelNata },
      { name: "Arroz Doce", price: "4.50€", description: "Arroz doce cremoso com canela" },
      { name: "Tarte de Amêndoa", price: "5.00€", description: "Tarte artesanal de amêndoa" },
      { name: "Pudim Abade de Priscos", price: "5.50€", description: "Pudim tradicional português" },
    ],
    bebidas: [
      { name: "Vinho da Casa (tinto/branco)", price: "3.50€", description: "Copo 150ml" },
      { name: "Vinho do Porto", price: "5.00€", description: "Copo 75ml" },
      { name: "Cerveja Sagres", price: "2.50€", description: "Imperial 200ml" },
      { name: "Água Mineral", price: "2.00€", description: "500ml" },
      { name: "Café Expresso", price: "1.20€", description: "Tradicional café português" },
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Menu Digital</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="entradas" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="entradas">Entradas</TabsTrigger>
            <TabsTrigger value="principais">Principais</TabsTrigger>
            <TabsTrigger value="sobremesas">Sobremesas</TabsTrigger>
            <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <TabsContent value="entradas" className="space-y-4">
              {menuSections.entradas.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    <span className="font-bold text-primary ml-4">{item.price}</span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="principais" className="space-y-4">
              {menuSections.principais.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-24 h-24 rounded-md object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <span className="font-bold text-primary ml-4">{item.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="sobremesas" className="space-y-4">
              {menuSections.sobremesas.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-24 h-24 rounded-md object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <span className="font-bold text-primary ml-4">{item.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="bebidas" className="space-y-4">
              {menuSections.bebidas.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                    <span className="font-bold text-primary ml-4">{item.price}</span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MenuDialog;
