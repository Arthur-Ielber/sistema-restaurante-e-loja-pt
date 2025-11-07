import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickReservationDialog from "@/components/QuickReservationDialog";
import MenuDialog from "@/components/MenuDialog";
import heroImage from "@/assets/hero-restaurant.jpg";
import dishBacalhau from "@/assets/dish-bacalhau.jpg";
import dishCataplana from "@/assets/dish-cataplana.jpg";
import dishPastelNata from "@/assets/dish-pastelnata.jpg";
import { Calendar, UtensilsCrossed, Wine, ChefHat } from "lucide-react";

const Index = () => {
  const [quickReservationOpen, setQuickReservationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Sabores de Alfama" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-overlay-dark/90 via-overlay-dark/70 to-overlay-dark/50" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Sabores Tradicionais<br />
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              de Lisboa
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experiência gastronómica única no coração de Alfama
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => setQuickReservationOpen(true)}
              className="group"
            >
              <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Reservar Mesa
            </Button>
            <Button 
              variant="accent" 
              size="xl"
              onClick={() => setMenuOpen(true)}
              className="group"
            >
              <UtensilsCrossed className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Ver Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Especialidades da Casa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pratos tradicionais portugueses preparados com ingredientes frescos e receitas autênticas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={dishBacalhau} 
                  alt="Bacalhau à Brás" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Bacalhau à Brás</h3>
                <p className="text-muted-foreground">
                  Bacalhau desfiado com batata palha crocante e ovos mexidos, decorado com azeitonas pretas
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">16.50€</span>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={dishCataplana} 
                  alt="Cataplana de Marisco" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Cataplana de Marisco</h3>
                <p className="text-muted-foreground">
                  Marisco fresco cozinhado na tradicional cataplana de cobre com molho aromático
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">24.00€</span>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={dishPastelNata} 
                  alt="Pastel de Nata" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Pastel de Nata</h3>
                <p className="text-muted-foreground">
                  Tradicional pastel de nata com massa folhada crocante e creme cremoso polvilhado com canela
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">2.50€</span>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/catalogo">
              <Button variant="hero" size="lg">
                Ver Catálogo Completo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Nossos Serviços
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Wine className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Degustação de Vinhos</h3>
              <p className="text-muted-foreground mb-4">
                Provas comentadas dos melhores vinhos portugueses
              </p>
              <Link to="/catalogo">
                <Button variant="outline">Saber Mais</Button>
              </Link>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <ChefHat className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Catering para Eventos</h3>
              <p className="text-muted-foreground mb-4">
                Serviço completo de catering para o seu evento especial
              </p>
              <Link to="/catalogo">
                <Button variant="outline">Saber Mais</Button>
              </Link>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Reservas de Grupo</h3>
              <p className="text-muted-foreground mb-4">
                Espaços reservados para grupos e eventos corporativos
              </p>
              <Link to="/reservas">
                <Button variant="outline">Reservar Agora</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <Footer />

      {/* Dialogs */}
      <QuickReservationDialog 
        open={quickReservationOpen} 
        onOpenChange={setQuickReservationOpen} 
      />
      <MenuDialog 
        open={menuOpen} 
        onOpenChange={setMenuOpen} 
      />
    </div>
  );
};

export default Index;
