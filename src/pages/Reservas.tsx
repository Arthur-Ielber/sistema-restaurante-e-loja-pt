import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useReserva } from "@/contexts/ReservaContext";
import { Calendar, Clock, Users, ShoppingBag, Utensils } from "lucide-react";

const Reservas = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { criarReserva } = useReserva();
  
  const [formData, setFormData] = useState({
    // Dados pessoais
    nome: "",
    email: "",
    telefone: "+351 ",
    
    // Reserva de Mesa
    dataMesa: searchParams.get("date") || "",
    horaMesa: searchParams.get("time") || "",
    numPessoas: searchParams.get("guests") || "",
    tipoMesa: "standard",
    
    // Produtos
    produtos: [] as string[],
    
    // Serviços
    servicos: [] as string[],
    
    // Observações
    observacoes: "",
  });

  const [activeTab, setActiveTab] = useState("mesa");

  useEffect(() => {
    // Se veio da reserva rápida, focar no tab de mesa
    if (searchParams.get("date")) {
      setActiveTab("mesa");
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.email || !formData.telefone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os dados pessoais.",
        variant: "destructive",
      });
      return;
    }

    // Validar telefone português
    const telefoneRegex = /^\+351\s?[0-9]{9}$/;
    if (!telefoneRegex.test(formData.telefone)) {
      toast({
        title: "Telefone inválido",
        description: "Por favor, insira um número de telefone português válido (+351 XXXXXXXXX).",
        variant: "destructive",
      });
      return;
    }

    // Verificar se há reserva de mesa
    if (!formData.dataMesa || !formData.horaMesa) {
      toast({
        title: "Reserva de mesa obrigatória",
        description: "Para criar uma reserva, é necessário selecionar data e hora da mesa.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Criar reserva (isso também cria a comanda automaticamente)
      const reservaId = criarReserva({
        nomeCliente: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        dataReserva: new Date(formData.dataMesa),
        horaReserva: formData.horaMesa,
        numPessoas: parseInt(formData.numPessoas) || 2,
        tipoMesa: formData.tipoMesa,
        observacoes: formData.observacoes || undefined,
        produtos: formData.produtos.length > 0 ? formData.produtos : undefined,
        servicos: formData.servicos.length > 0 ? formData.servicos : undefined,
      });

      toast({
        title: "Reserva confirmada! ✓",
        description: "Sua reserva foi criada e uma comanda foi aberta automaticamente. Você pode adicionar itens à sua comanda.",
      });

      // Limpar formulário
      setFormData({
        nome: "",
        email: "",
        telefone: "+351 ",
        dataMesa: "",
        horaMesa: "",
        numPessoas: "",
        tipoMesa: "standard",
        produtos: [],
        servicos: [],
        observacoes: "",
      });

      // Redirecionar para a página de pedidos após um breve delay
      setTimeout(() => {
        navigate("/pedidos");
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro ao criar reserva",
        description: "Ocorreu um erro ao criar a reserva. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const produtos = [
    { id: "vinho-porto", name: "Vinho do Porto Vintage", price: "45.00€" },
    { id: "azeite", name: "Azeite Virgem Extra", price: "18.50€" },
    { id: "voucher", name: "Voucher Presente 50€", price: "50.00€" },
    { id: "kit", name: "Kit Degustação", price: "35.00€" },
  ];

  const servicos = [
    { id: "degustacao", name: "Degustação de Vinhos", price: "25€/pessoa" },
    { id: "catering", name: "Catering Corporativo", price: "30€/pessoa" },
    { id: "fado", name: "Jantar Temático Fado", price: "60€/pessoa" },
    { id: "aula", name: "Aulas de Culinária", price: "75€/pessoa" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Sistema de Reservas
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete o formulário para realizar a sua reserva
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>
                  Informações necessárias para confirmar a sua reserva
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="João Silva"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="joao.silva@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone (Portugal) *</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="+351 912 345 678"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Formato: +351 seguido de 9 dígitos
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tipo de Reserva */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Reserva</CardTitle>
                <CardDescription>
                  Selecione o que deseja reservar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="mesa">
                      <Utensils className="mr-2 h-4 w-4" />
                      Mesa
                    </TabsTrigger>
                    <TabsTrigger value="produtos">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Produtos
                    </TabsTrigger>
                    <TabsTrigger value="servicos">
                      <Calendar className="mr-2 h-4 w-4" />
                      Serviços
                    </TabsTrigger>
                  </TabsList>

                  {/* Reserva de Mesa */}
                  <TabsContent value="mesa" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dataMesa" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Data
                        </Label>
                        <Input
                          id="dataMesa"
                          type="date"
                          value={formData.dataMesa}
                          onChange={(e) => setFormData({ ...formData, dataMesa: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="horaMesa" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Hora
                        </Label>
                        <Input
                          id="horaMesa"
                          type="time"
                          value={formData.horaMesa}
                          onChange={(e) => setFormData({ ...formData, horaMesa: e.target.value })}
                          min="12:00"
                          max="23:00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="numPessoas" className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Pessoas
                        </Label>
                        <Input
                          id="numPessoas"
                          type="number"
                          min="1"
                          max="12"
                          value={formData.numPessoas}
                          onChange={(e) => setFormData({ ...formData, numPessoas: e.target.value })}
                          placeholder="2"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipoMesa">Tipo de Mesa</Label>
                      <select
                        id="tipoMesa"
                        value={formData.tipoMesa}
                        onChange={(e) => setFormData({ ...formData, tipoMesa: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="standard">Mesa Standard</option>
                        <option value="janela">Mesa junto à Janela</option>
                        <option value="privada">Sala Privada (+50€)</option>
                        <option value="terraco">Terraço (sujeito a disponibilidade)</option>
                      </select>
                    </div>
                  </TabsContent>

                  {/* Produtos */}
                  <TabsContent value="produtos" className="space-y-4 mt-6">
                    <div className="space-y-3">
                      {produtos.map((produto) => (
                        <div key={produto.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={produto.id}
                              checked={formData.produtos.includes(produto.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({ 
                                    ...formData, 
                                    produtos: [...formData.produtos, produto.id] 
                                  });
                                } else {
                                  setFormData({ 
                                    ...formData, 
                                    produtos: formData.produtos.filter(p => p !== produto.id) 
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={produto.id} className="cursor-pointer font-medium">
                              {produto.name}
                            </Label>
                          </div>
                          <span className="font-bold text-primary">{produto.price}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Serviços */}
                  <TabsContent value="servicos" className="space-y-4 mt-6">
                    <div className="space-y-3">
                      {servicos.map((servico) => (
                        <div key={servico.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={servico.id}
                              checked={formData.servicos.includes(servico.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({ 
                                    ...formData, 
                                    servicos: [...formData.servicos, servico.id] 
                                  });
                                } else {
                                  setFormData({ 
                                    ...formData, 
                                    servicos: formData.servicos.filter(s => s !== servico.id) 
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={servico.id} className="cursor-pointer font-medium">
                              {servico.name}
                            </Label>
                          </div>
                          <span className="font-bold text-primary">{servico.price}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
                <CardDescription>
                  Informações adicionais sobre a sua reserva (opcional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Ex: Alergias alimentares, preferências especiais, ocasião especial..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Botão de Submissão */}
            <div className="flex justify-center pt-4">
              <Button type="submit" variant="hero" size="xl" className="min-w-[300px]">
                Confirmar Reserva
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservas;
