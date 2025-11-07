import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">Sabores de Alfama</h3>
            <p className="text-sm leading-relaxed opacity-90">
              Experiência gastronómica única no coração de Lisboa. 
              Sabores tradicionais portugueses com um toque gourmet moderno.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Morada</p>
                  <p className="opacity-90">Rua de São Miguel, 28<br />1100-548 Lisboa, Portugal</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="opacity-90">+351 21 234 5678</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="opacity-90">contacto@saboresalfama.pt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horário</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p><span className="font-medium">Terça a Sexta:</span> 12:00 - 23:00</p>
                  <p><span className="font-medium">Sábado e Domingo:</span> 12:00 - 00:00</p>
                  <p className="text-accent font-medium">Segunda-feira: Encerrado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-foreground/20 text-center text-sm opacity-75">
          <p>&copy; {new Date().getFullYear()} Sabores de Alfama. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
