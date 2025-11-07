import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import dishBacalhau from "@/assets/dish-bacalhau.jpg";
import dishCataplana from "@/assets/dish-cataplana.jpg";
import dishPastelNata from "@/assets/dish-pastelnata.jpg";
import { Wine, UtensilsCrossed, Calendar, Gift } from "lucide-react";

const Catalogo = () => {
  const produtos = [
    {
      name: "Vinho do Porto Vintage",
      price: "45.00€",
      description: "Vinho do Porto envelhecido, ideal para presente",
      icon: Wine,
    },
    {
      name: "Azeite Virgem Extra",
      price: "18.50€",
      description: "Azeite português premium de produção artesanal",
      icon: Gift,
    },
    {
      name: "Voucher Presente 50€",
      price: "50.00€",
      description: "Vale-presente para usar no restaurante",
      icon: Gift,
    },
    {
      name: "Kit Degustação",
      price: "35.00€",
      description: "Seleção de queijos e enchidos portugueses",
      icon: UtensilsCrossed,
    },
  ];

  const mesas = [
    {
      name: "Mesa Íntima (2 pessoas)",
      price: "Reserva gratuita",
      description: "Mesa romântica junto à janela",
      disponivel: true,
    },
    {
      name: "Mesa Familiar (4-6 pessoas)",
      price: "Reserva gratuita",
      description: "Mesa ampla no salão principal",
      disponivel: true,
    },
    {
      name: "Sala Privada (8-12 pessoas)",
      price: "50€ reserva",
      description: "Espaço exclusivo com ambiente reservado",
      disponivel: true,
    },
    {
      name: "Terraço (4 pessoas)",
      price: "Reserva gratuita",
      description: "Vista panorâmica de Alfama (sujeito a condições climáticas)",
      disponivel: false,
    },
  ];

  const servicos = [
    {
      name: "Degustação de Vinhos",
      price: "25€/pessoa",
      description: "Prova comentada de 5 vinhos portugueses com queijos",
      duracao: "90 minutos",
    },
    {
      name: "Catering Corporativo",
      price: "A partir de 30€/pessoa",
      description: "Menu completo para eventos empresariais",
      duracao: "Serviço completo",
    },
    {
      name: "Jantar Temático Fado",
      price: "60€/pessoa",
      description: "Menu completo com espetáculo de Fado ao vivo",
      duracao: "3 horas",
    },
    {
      name: "Aulas de Culinária",
      price: "75€/pessoa",
      description: "Aprenda a preparar pratos tradicionais portugueses",
      duracao: "3 horas",
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
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <produto.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{produto.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{produto.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">{produto.price}</span>
                        <Link to="/reservas">
                          <Button variant="outline" size="sm">
                            Encomendar
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
                  <Card key={index} className={`hover:shadow-lg transition-shadow ${!mesa.disponivel ? 'opacity-60' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{mesa.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{mesa.description}</p>
                        </div>
                        {!mesa.disponivel && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            Indisponível
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{mesa.price}</span>
                        <Link to="/reservas">
                          <Button variant={mesa.disponivel ? "default" : "outline"} size="sm" disabled={!mesa.disponivel}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Reservar
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
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl">{servico.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{servico.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-primary block">{servico.price}</span>
                          <span className="text-sm text-muted-foreground">{servico.duracao}</span>
                        </div>
                      </div>
                      <Link to="/reservas">
                        <Button variant="default" className="w-full">
                          Agendar Serviço
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
