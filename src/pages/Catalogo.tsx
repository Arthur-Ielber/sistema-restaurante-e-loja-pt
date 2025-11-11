import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Wine, UtensilsCrossed, Calendar, Gift } from "lucide-react";

const Catalogo = () => {
  const produtos = [
    {
      name: "Vinho do Porto Vintage",
      price: "45.00€",
      description: "Vinho do Porto envelhecido, ideal para presente",
      icon: Wine,
      image: "/img-menu/bebida-vinho-porto.jpg",
    },
    {
      name: "Azeite Virgem Extra",
      price: "18.50€",
      description: "Azeite português premium de produção artesanal",
      icon: Gift,
      image: "/img-catalogo/produto-azeite.jpg",
    },
    {
      name: "Voucher Presente 50€",
      price: "50.00€",
      description: "Vale-presente para usar no restaurante",
      icon: Gift,
      image: "/img-catalogo/produto-voucher.jpg",
    },
    {
      name: "Kit Degustação",
      price: "35.00€",
      description: "Seleção de queijos e enchidos portugueses",
      icon: UtensilsCrossed,
      image: "/img-catalogo/produto-kit-degustacao.jpg",
    },
  ];

  const mesas = [
    {
      name: "Mesa Íntima (2 pessoas)",
      price: "Reserva gratuita",
      description: "Mesa romântica junto à janela",
      disponivel: true,
      image: "/img-catalogo/mesa-intima.jpg",
    },
    {
      name: "Mesa Familiar (4-6 pessoas)",
      price: "Reserva gratuita",
      description: "Mesa ampla no salão principal",
      disponivel: true,
      image: "/img-catalogo/mesa-familiar.jpg",
    },
    {
      name: "Sala Privada (8-12 pessoas)",
      price: "50€ reserva",
      description: "Espaço exclusivo com ambiente reservado",
      disponivel: true,
      image: "/img-catalogo/sala-privada.jpg",
    },
    {
      name: "Terraço (4 pessoas)",
      price: "Reserva gratuita",
      description: "Vista panorâmica de Alfama (sujeito a condições climáticas)",
      disponivel: false,
      image: "/img-catalogo/terraco.jpg",
    },
  ];

  const servicos = [
    {
      name: "Degustação de Vinhos",
      price: "25€/pessoa",
      description: "Prova comentada de 5 vinhos portugueses com queijos",
      duracao: "90 minutos",
      image: "/img-catalogo/servico-degustacao-vinhos.jpg",
    },
    {
      name: "Catering Corporativo",
      price: "A partir de 30€/pessoa",
      description: "Menu completo para eventos empresariais",
      duracao: "Serviço completo",
      image: "/img-catalogo/servico-catering-corporativo.jpg",
    },
    {
      name: "Jantar Temático Fado",
      price: "60€/pessoa",
      description: "Menu completo com espetáculo de Fado ao vivo",
      duracao: "3 horas",
      image: "/img-catalogo/servico-jantar-fado.jpg",
    },
    {
      name: "Aulas de Culinária",
      price: "75€/pessoa",
      description: "Aprenda a preparar pratos tradicionais portugueses",
      duracao: "3 horas",
      image: "/img-catalogo/servico-aulas-culinaria.jpg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Catálogo Completo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore nossos produtos, reserve mesas e descubra nossos serviços exclusivos
            </p>
          </div>

          <Tabs defaultValue="produtos" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12">
              <TabsTrigger value="produtos" className="text-base">
                Produtos
              </TabsTrigger>
              <TabsTrigger value="mesas" className="text-base">
                Mesas
              </TabsTrigger>
              <TabsTrigger value="servicos" className="text-base">
                Serviços
              </TabsTrigger>
            </TabsList>

            {/* Produtos */}
            <TabsContent value="produtos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {produtos.map((produto, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                    <div className="aspect-square overflow-hidden bg-muted relative">
                      <img 
                        src={produto.image} 
                        alt={produto.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                        <produto.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold">{produto.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-muted-foreground mb-4 text-sm flex-1">{produto.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-2xl font-bold text-primary">{produto.price}</span>
                        <Link to="/reservas">
                          <Button variant="outline" size="sm" className="group/btn">
                            <span className="group-hover/btn:translate-x-1 transition-transform duration-300 inline-block">
                              Encomendar
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Mesas */}
            <TabsContent value="mesas">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {mesas.map((mesa, index) => (
                  <Card key={index} className={`overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full ${!mesa.disponivel ? 'opacity-60' : ''}`}>
                    <div className="aspect-video overflow-hidden bg-muted relative">
                      <img 
                        src={mesa.image} 
                        alt={mesa.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      {!mesa.disponivel && (
                        <div className="absolute top-3 right-3 bg-muted/90 backdrop-blur-sm text-muted-foreground px-3 py-1 rounded-md text-xs font-medium">
                          Indisponível
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold">{mesa.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">{mesa.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                        <span className="text-lg font-bold text-primary">{mesa.price}</span>
                        <Link to="/reservas">
                          <Button variant={mesa.disponivel ? "default" : "outline"} size="sm" disabled={!mesa.disponivel} className="group/btn">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span className="group-hover/btn:translate-x-1 transition-transform duration-300 inline-block">
                              Reservar
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Serviços */}
            <TabsContent value="servicos">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {servicos.map((servico, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                    <div className="aspect-video overflow-hidden bg-muted relative">
                      <img 
                        src={servico.image} 
                        alt={servico.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold">{servico.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">{servico.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-primary block">{servico.price}</span>
                          <span className="text-sm text-muted-foreground">{servico.duracao}</span>
                        </div>
                      </div>
                      <Link to="/reservas" className="mt-auto">
                        <Button variant="default" className="w-full group/btn">
                          <span className="group-hover/btn:translate-x-1 transition-transform duration-300 inline-block">
                            Agendar Serviço
                          </span>
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-16">
            <Link to="/reservas">
              <Button variant="hero" size="lg">
                Fazer Reserva Completa
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalogo;
