import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface ComandaItem {
  id: string;
  name: string;
  price: string; // Formato: "8.50€"
  description: string;
  image?: string;
  quantity: number;
  category: "entradas" | "principais" | "sobremesas" | "bebidas";
  confirmed: boolean; // Se o item foi confirmado, não pode ser removido
}

export type ComandaStatus = "aberta" | "fechada" | "paga";
export type FormaPagamento = "dinheiro" | "cartao" | "multibanco" | "mbway" | "";

export interface Comanda {
  id: string;
  numero: number; // Número da comanda
  nomeCliente: string; // Nome completo do cliente
  items: ComandaItem[];
  status: ComandaStatus;
  formaPagamento?: FormaPagamento;
  dataAbertura: Date;
  dataFechamento?: Date;
  dataPagamento?: Date;
  total: number;
  observacoes?: string;
}

interface ComandaContextType {
  // Comanda atual (aberta)
  comandaAtual: Comanda | null;
  
  // Lista de todas as comandas
  comandas: Comanda[];
  
  // Criar nova comanda
  criarComanda: (nomeCliente: string) => string;
  
  // Selecionar comanda atual
  selecionarComanda: (comandaId: string) => void;
  
  // Gerenciar itens da comanda atual
  adicionarItem: (item: Omit<ComandaItem, "quantity" | "confirmed">, quantity?: number) => void;
  removerItem: (itemId: string) => void;
  atualizarQuantidade: (itemId: string, quantity: number) => void;
  
  // Confirmar itens (não podem mais ser removidos)
  confirmarItens: () => void;
  
  // Finalizar comanda (fechar)
  fecharComanda: (formaPagamento: FormaPagamento, observacoes?: string) => void;
  
  // Marcar como paga
  marcarComoPaga: (comandaId: string) => void;
  
  // Obter totais
  getTotalComanda: (comandaId?: string) => number;
  getTotalFormatado: (comandaId?: string) => string;
  getItemCount: (comandaId?: string) => number;
  
  // Obter comandas por status
  getComandasAbertas: () => Comanda[];
  getComandasFechadas: () => Comanda[];
  getComandasPagas: () => Comanda[];
  
  // Obter vendas do dia
  getVendasDoDia: () => Comanda[];
  getTotalVendasDoDia: () => number;
}

const ComandaContext = createContext<ComandaContextType | undefined>(undefined);

const STORAGE_KEY = "comandas_sabores_alfama";

export const ComandaProvider = ({ children }: { children: ReactNode }) => {
  const [comandas, setComandas] = useState<Comanda[]>(() => {
    // Carregar comandas do localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Converter datas de string para Date e adicionar nomeCliente se não existir
        return parsed.map((c: any) => ({
          ...c,
          nomeCliente: c.nomeCliente || "Cliente não informado",
          dataAbertura: new Date(c.dataAbertura),
          dataFechamento: c.dataFechamento ? new Date(c.dataFechamento) : undefined,
          dataPagamento: c.dataPagamento ? new Date(c.dataPagamento) : undefined,
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar comandas:", error);
    }
    return [];
  });

  const [comandaAtualId, setComandaAtualId] = useState<string | null>(() => {
    // Buscar comanda aberta mais recente
    const comandaAberta = comandas.find((c) => c.status === "aberta");
    return comandaAberta ? comandaAberta.id : null;
  });

  // Salvar comandas no localStorage sempre que houver mudanças
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comandas));
    } catch (error) {
      console.error("Erro ao salvar comandas:", error);
    }
  }, [comandas]);

  const comandaAtual = comandas.find((c) => c.id === comandaAtualId) || null;

  // Extrai o valor numérico do preço (ex: "8.50€" -> 8.50)
  const parsePrice = (price: string): number => {
    return parseFloat(price.replace("€", "").replace(",", ".").trim());
  };

  // Gerar próximo número de comanda
  const getProximoNumero = (): number => {
    if (comandas.length === 0) return 1;
    const maxNumero = Math.max(...comandas.map((c) => c.numero));
    return maxNumero + 1;
  };

  // Criar nova comanda
  const criarComanda = (nomeCliente: string): string => {
    const novoNumero = getProximoNumero();
    const novaComanda: Comanda = {
      id: `comanda-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      numero: novoNumero,
      nomeCliente,
      items: [],
      status: "aberta",
      dataAbertura: new Date(),
      total: 0,
    };

    setComandas((prev) => [...prev, novaComanda]);
    setComandaAtualId(novaComanda.id);
    return novaComanda.id;
  };

  // Selecionar comanda
  const selecionarComanda = (comandaId: string) => {
    const comanda = comandas.find((c) => c.id === comandaId);
    if (comanda && comanda.status === "aberta") {
      setComandaAtualId(comandaId);
    }
  };

  // Adicionar item à comanda atual (com quantidade)
  const adicionarItem = (item: Omit<ComandaItem, "quantity" | "confirmed">, quantity: number = 1) => {
    if (!comandaAtual) {
      // Não criar comanda automaticamente - deve ser criada com nome do cliente
      console.error("Nenhuma comanda aberta. Crie uma comanda primeiro.");
      return;
    }

    setComandas((prev) =>
      prev.map((comanda) => {
        if (comanda.id === comandaAtual.id) {
          const existingItem = comanda.items.find((i) => i.id === item.id && !i.confirmed);
          if (existingItem) {
            // Se o item já existe e não está confirmado, aumenta a quantidade
            const novosItems = comanda.items.map((i) =>
              i.id === item.id && !i.confirmed
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
            const total = calcularTotal(novosItems);
            return { ...comanda, items: novosItems, total };
          } else {
            // Adiciona novo item não confirmado com a quantidade especificada
            const novoItem: ComandaItem = {
              ...item,
              quantity,
              confirmed: false,
            };
            const novosItems = [...comanda.items, novoItem];
            const total = calcularTotal(novosItems);
            return { ...comanda, items: novosItems, total };
          }
        }
        return comanda;
      })
    );
  };

  // Remover item (apenas se não estiver confirmado)
  const removerItem = (itemId: string) => {
    if (!comandaAtual) return;

    setComandas((prev) =>
      prev.map((comanda) => {
        if (comanda.id === comandaAtual.id) {
          const novosItems = comanda.items.filter(
            (item) => !(item.id === itemId && !item.confirmed)
          );
          const total = calcularTotal(novosItems);
          return { ...comanda, items: novosItems, total };
        }
        return comanda;
      })
    );
  };

  // Atualizar quantidade (apenas se não estiver confirmado)
  const atualizarQuantidade = (itemId: string, quantity: number) => {
    if (!comandaAtual) return;
    if (quantity <= 0) {
      removerItem(itemId);
      return;
    }

    setComandas((prev) =>
      prev.map((comanda) => {
        if (comanda.id === comandaAtual.id) {
          const novosItems = comanda.items.map((item) =>
            item.id === itemId && !item.confirmed
              ? { ...item, quantity }
              : item
          );
          const total = calcularTotal(novosItems);
          return { ...comanda, items: novosItems, total };
        }
        return comanda;
      })
    );
  };

  // Calcular total de uma lista de itens
  const calcularTotal = (items: ComandaItem[]): number => {
    return items.reduce((total, item) => {
      return total + parsePrice(item.price) * item.quantity;
    }, 0);
  };

  // Confirmar itens (não podem mais ser removidos)
  const confirmarItens = () => {
    if (!comandaAtual) return;

    setComandas((prev) =>
      prev.map((comanda) => {
        if (comanda.id === comandaAtual.id) {
          const novosItems = comanda.items.map((item) => ({
            ...item,
            confirmed: true,
          }));
          const total = calcularTotal(novosItems);
          return { ...comanda, items: novosItems, total };
        }
        return comanda;
      })
    );
  };

  // Fechar comanda (marcar como paga diretamente, já que foi paga)
  const fecharComanda = (formaPagamento: FormaPagamento, observacoes?: string) => {
    if (!comandaAtual) return;

    setComandas((prev) =>
      prev.map((comanda) => {
        if (comanda.id === comandaAtual.id) {
          // Confirmar todos os itens antes de fechar
          const novosItems = comanda.items.map((item) => ({
            ...item,
            confirmed: true,
          }));
          const total = calcularTotal(novosItems);
          const agora = new Date();
          return {
            ...comanda,
            items: novosItems,
            status: "paga",
            formaPagamento,
            dataFechamento: agora,
            dataPagamento: agora,
            total,
            observacoes,
          };
        }
        return comanda;
      })
    );

    setComandaAtualId(null);
  };

  // Marcar comanda como paga (para comandas fechadas)
  const marcarComoPaga = (comandaId: string, formaPagamento?: FormaPagamento) => {
    setComandas((prev) =>
      prev.map((comanda) => {
        if (comanda.id === comandaId) {
          return {
            ...comanda,
            status: "paga",
            formaPagamento: formaPagamento || comanda.formaPagamento || "",
            dataPagamento: new Date(),
          };
        }
        return comanda;
      })
    );
  };

  // Obter total da comanda
  const getTotalComanda = (comandaId?: string): number => {
    const comanda = comandaId
      ? comandas.find((c) => c.id === comandaId)
      : comandaAtual;
    return comanda ? calcularTotal(comanda.items) : 0;
  };

  // Obter total formatado
  const getTotalFormatado = (comandaId?: string): string => {
    return `${getTotalComanda(comandaId).toFixed(2)}€`;
  };

  // Obter contagem de itens
  const getItemCount = (comandaId?: string): number => {
    const comanda = comandaId
      ? comandas.find((c) => c.id === comandaId)
      : comandaAtual;
    return comanda
      ? comanda.items.reduce((count, item) => count + item.quantity, 0)
      : 0;
  };

  // Obter comandas abertas
  const getComandasAbertas = (): Comanda[] => {
    return comandas.filter((c) => c.status === "aberta");
  };

  // Obter comandas fechadas (mas não pagas)
  const getComandasFechadas = (): Comanda[] => {
    return comandas.filter((c) => c.status === "fechada");
  };

  // Obter comandas pagas
  const getComandasPagas = (): Comanda[] => {
    return comandas.filter((c) => c.status === "paga");
  };

  // Obter vendas do dia
  const getVendasDoDia = (): Comanda[] => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return comandas.filter((c) => {
      if (c.status !== "paga") return false;
      const dataPagamento = c.dataPagamento || c.dataFechamento;
      if (!dataPagamento) return false;
      return dataPagamento >= hoje;
    });
  };

  // Obter total de vendas do dia
  const getTotalVendasDoDia = (): number => {
    return getVendasDoDia().reduce((total, comanda) => total + comanda.total, 0);
  };

  return (
    <ComandaContext.Provider
      value={{
        comandaAtual,
        comandas,
        criarComanda,
        selecionarComanda,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        confirmarItens,
        fecharComanda,
        marcarComoPaga,
        getTotalComanda,
        getTotalFormatado,
        getItemCount,
        getComandasAbertas,
        getComandasFechadas,
        getComandasPagas,
        getVendasDoDia,
        getTotalVendasDoDia,
      }}
    >
      {children}
    </ComandaContext.Provider>
  );
};

export const useComanda = () => {
  const context = useContext(ComandaContext);
  if (context === undefined) {
    throw new Error("useComanda must be used within a ComandaProvider");
  }
  return context;
};

