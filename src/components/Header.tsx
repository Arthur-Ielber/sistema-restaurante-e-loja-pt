import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone, MapPin, Menu, Home, BookOpen, Calendar, ShoppingCart, LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "@/components/NavLink";
import { useComanda } from "@/contexts/ComandaContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getItemCount, comandaAtual } = useComanda();
  const { user, logout, isAuthenticated, isAdmin, isGarcom } = useAuth();
  const cartItemCount = comandaAtual ? getItemCount() : 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Início", icon: Home },
    { path: "/catalogo", label: "Catálogo", icon: BookOpen },
    { path: "/reservas", label: "Reservas", icon: Calendar },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group transition-transform hover:scale-105 duration-300"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary transition-all duration-300">
              Sabores de Alfama
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md group",
                    active
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                  activeClassName=""
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      active ? "scale-110" : "group-hover:scale-110"
                    )} />
                    {item.label}
                  </span>
                  {active && (
                    <span className="absolute inset-0 bg-primary/10 rounded-md animate-in fade-in duration-300" />
                  )}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-3/4" />
                </NavLink>
              );
            })}
          </nav>

          {/* Contact Info & CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 group">
                <Phone className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">+351 21 234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 group">
                <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Lisboa</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              {/* Botão de Comanda - visível para todos quando há comanda ou para garçons/admins */}
              {(isAuthenticated || cartItemCount > 0) && (
                <Link to="/pedidos" className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "relative transition-all duration-300",
                      isActive("/pedidos") ? "text-primary" : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {cartItemCount > 9 ? "9+" : cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {/* Painel de Comandas - apenas para admin e garçom */}
              {(isAdmin || isGarcom) && (
                <Link to="/painel">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "relative transition-all duration-300",
                      isActive("/painel") ? "text-primary" : "text-foreground/70 hover:text-foreground"
                    )}
                    title="Painel de Comandas"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              
              {/* Botão de Reserva - sempre visível */}
              <Link to="/reservas">
                <Button 
                  variant="hero" 
                  size="default"
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Calendar className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                    Reservar Mesa
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </Link>

              {/* Login/Logout */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.nome}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-primary capitalize">{user?.role}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate("/admin")}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Administração
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button variant="outline" size="default">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative md:hidden">
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Sabores de Alfama
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 group",
                          active
                            ? "bg-primary/10 text-primary border-l-4 border-primary"
                            : "text-foreground/70 hover:bg-accent hover:text-foreground"
                        )}
                        activeClassName=""
                      >
                        <Icon className={cn(
                          "h-5 w-5 transition-transform duration-300",
                          active ? "scale-110" : "group-hover:scale-110"
                        )} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>+351 21 234 5678</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Lisboa</span>
                    </div>
                  </div>
                  <Link to="/pedidos" onClick={() => setMobileMenuOpen(false)} className="mt-6 block">
                    <Button 
                      variant={isActive("/pedidos") ? "default" : "outline"} 
                      size="lg" 
                      className="w-full relative"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Comanda
                      {cartItemCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {cartItemCount > 9 ? "9+" : cartItemCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  <Link to="/painel" onClick={() => setMobileMenuOpen(false)} className="mt-4 block">
                    <Button 
                      variant={isActive("/painel") ? "default" : "outline"} 
                      size="lg" 
                      className="w-full"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Painel de Comandas
                    </Button>
                  </Link>
                  <Link to="/reservas" onClick={() => setMobileMenuOpen(false)} className="mt-4 block">
                    <Button variant="hero" size="lg" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Reservar Mesa
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
