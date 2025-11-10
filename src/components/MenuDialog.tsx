import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useComanda } from "@/contexts/ComandaContext";
import ConfirmarItemDialog from "@/components/ConfirmarItemDialog";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import dishBacalhau from "@/assets/dish-bacalhau.jpg";
import dishCataplana from "@/assets/dish-cataplana.jpg";
import dishPastelNata from "@/assets/dish-pastelnata.jpg";

interface MenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modoVisualizacao?: boolean; // Se true, apenas visualização sem opção de adicionar
}

const MenuDialog = ({ open, onOpenChange, modoVisualizacao = false }: MenuDialogProps) => {
  const { adicionarItem, comandaAtual } = useComanda();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    price: string;
    description: string;
    image: string;
    category: "entradas" | "principais" | "sobremesas" | "bebidas";
  } | null>(null);

  const handleAddToCart = (
    name: string,
    price: string,
    description: string,
    image: string,
    category: "entradas" | "principais" | "sobremesas" | "bebidas"
  ) => {
    // Verificar se tem comanda aberta
    if (!comandaAtual) {
      toast({
        title: "Comanda não aberta",
        description: "Você precisa abrir uma comanda primeiro para adicionar itens.",
        variant: "destructive",
      });
      return;
    }

    // Abrir dialog de confirmação
    setSelectedItem({ name, price, description, image, category });
    setConfirmDialogOpen(true);
  };

  const handleConfirmItem = (quantity: number) => {
    if (!selectedItem || !comandaAtual) return;

    const id = `${selectedItem.category}-${selectedItem.name.toLowerCase().replace(/\s+/g, "-")}`;
    
    adicionarItem(
      {
        id,
        name: selectedItem.name,
        price: selectedItem.price,
        description: selectedItem.description,
        image: selectedItem.image,
        category: selectedItem.category,
      },
      quantity
    );

    toast({
      title: "Item adicionado!",
      description: `${quantity}x ${selectedItem.name} foi adicionado à comanda.`,
    });

    setSelectedItem(null);
  };

  // Função auxiliar para obter a URL da imagem
  const getImageUrl = (image: string | any): string => {
    if (typeof image === "string") {
      return image;
    }
    // Se for um import de imagem (objeto com src)
    if (image && typeof image === "object" && image.src) {
      return image.src;
    }
    return "";
  };

  const menuSections = {
    entradas: [
      { name: "Pataniscas de Bacalhau", price: "8.50€", description: "Bolinhos de bacalhau crocantes", image: "/img-menu/entrada-pataniscas-bacalhau.jpg" },
      { name: "Queijo da Serra com Doce", price: "9.00€", description: "Queijo artesanal com doce de abóbora", image: "/img-menu/entrada-queijo-serra.jpg" },
      { name: "Presunto Ibérico", price: "12.00€", description: "Fatias finas de presunto curado", image: "/img-menu/entrada-presunto-iberico.jpg" },
      { name: "Ameijoas à Bulhão Pato", price: "11.50€", description: "Ameijoas frescas com alho e coentros", image: "/img-menu/entrada-ameijoas.jpg" },
    ],
    principais: [
      { name: "Bacalhau à Brás", price: "16.50€", description: "Bacalhau desfiado com batata palha e ovos", image: dishBacalhau },
      { name: "Cataplana de Marisco", price: "24.00€", description: "Marisco fresco na tradicional cataplana", image: dishCataplana },
      { name: "Polvo à Lagareiro", price: "22.00€", description: "Polvo grelhado com batatas a murro", image: "/img-menu/principal-polvo-lagareiro.jpg" },
      { name: "Arroz de Pato", price: "18.50€", description: "Arroz cremoso com pato desfiado", image: "/img-menu/principal-arroz-pato.jpg" },
      { name: "Bife à Café", price: "19.00€", description: "Lombo de vaca com molho de café", image: "/img-menu/principal-bife-cafe.jpg" },
    ],
    sobremesas: [
      { name: "Pastel de Nata", price: "2.50€", description: "Tradicional pastel de Belém", image: dishPastelNata },
      { name: "Arroz Doce", price: "4.50€", description: "Arroz doce cremoso com canela", image: "/img-menu/sobremesa-arroz-doce.jpg" },
      { name: "Tarte de Amêndoa", price: "5.00€", description: "Tarte artesanal de amêndoa", image: "/img-menu/sobremesa-tarte-amendoa.jpg" },
      { name: "Pudim Abade de Priscos", price: "5.50€", description: "Pudim tradicional português", image: "/img-menu/sobremesa-pudim.jpg" },
    ],
    bebidas: [
      { name: "Vinho da Casa (tinto/branco)", price: "3.50€", description: "Copo 150ml", image: "/img-menu/bebida-vinho-casa.jpg" },
      { name: "Vinho do Porto", price: "5.00€", description: "Copo 75ml", image: "/img-menu/bebida-vinho-porto.jpg" },
      { name: "Cerveja Sagres", price: "2.50€", description: "Imperial 200ml", image: "/img-menu/bebida-cerveja.jpg" },
      { name: "Água Mineral", price: "2.00€", description: "500ml", image: "/img-menu/bebida-agua.jpg" },
      { name: "Café Expresso", price: "1.20€", description: "Tradicional café português", image: "/img-menu/bebida-cafe.jpg" },
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
                  <div className="flex gap-4">
                    {item.image && (
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-24 h-24 rounded-md object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <span className="font-bold text-primary ml-4">{item.price}</span>
                      </div>
                      {!modoVisualizacao && (
                        <div className="mt-3">
                          {comandaAtual ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddToCart(item.name, item.price, item.description, item.image || "", "entradas")}
                              className="w-full sm:w-auto"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar à Comanda
                            </Button>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              Abra uma comanda para adicionar itens
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="principais" className="space-y-4">
              {menuSections.principais.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {item.image && (
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-24 h-24 rounded-md object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <span className="font-bold text-primary ml-4">{item.price}</span>
                      </div>
                      {!modoVisualizacao && (
                        <div className="mt-3">
                          {comandaAtual ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddToCart(item.name, item.price, item.description, getImageUrl(item.image), "principais")}
                              className="w-full sm:w-auto"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar à Comanda
                            </Button>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              Abra uma comanda para adicionar itens
                            </p>
                          )}
                        </div>
                      )}
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
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-24 h-24 rounded-md object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <span className="font-bold text-primary ml-4">{item.price}</span>
                      </div>
                      {!modoVisualizacao && (
                        <div className="mt-3">
                          {comandaAtual ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddToCart(item.name, item.price, item.description, getImageUrl(item.image), "sobremesas")}
                              className="w-full sm:w-auto"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar à Comanda
                            </Button>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              Abra uma comanda para adicionar itens
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="bebidas" className="space-y-4">
              {menuSections.bebidas.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {item.image && (
                      <img src={getImageUrl(item.image)} alt={item.name} className="w-24 h-24 rounded-md object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <span className="font-bold text-primary ml-4">{item.price}</span>
                      </div>
                      {!modoVisualizacao && (
                        <div className="mt-3">
                          {comandaAtual ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddToCart(item.name, item.price, item.description, item.image || "", "bebidas")}
                              className="w-full sm:w-auto"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar à Comanda
                            </Button>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              Abra uma comanda para adicionar itens
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>

      {/* Dialog de Confirmação de Item */}
      {selectedItem && (
        <ConfirmarItemDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          itemName={selectedItem.name}
          itemPrice={selectedItem.price}
          itemImage={selectedItem.image}
          onConfirm={handleConfirmItem}
        />
      )}
    </Dialog>
  );
};

export default MenuDialog;
