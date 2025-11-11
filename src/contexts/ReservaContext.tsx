import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useComanda, Comanda } from "./ComandaContext";

export interface Reserva {
  id: string;
  nomeCliente: string;
  email: string;
  telefone: string;
  dataReserva: Date;
  horaReserva: string;
  numPessoas: number;
  tipoMesa: string;
  comandaId?: string; // ID da comanda associada
  status: "pendente" | "confirmada" | "cancelada" | "expirada";
  observacoes?: string;
  produtos?: string[];
  servicos?: string[];
  dataCriacao: Date;
}

interface ReservaContextType {
  reservas: Reserva[];
  criarReserva: (dados: Omit<Reserva, "id" | "dataCriacao" | "status" | "comandaId">) => string;
  cancelarReserva: (reservaId: string) => void;
  confirmarReserva: (reservaId: string) => void;
  getReservasPendentes: () => Reserva[];
  getReservasConfirmadas: () => Reserva[];
  verificarTimeoutReservas: () => void;
}

const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

const STORAGE_KEY = "reservas_sabores_alfama";
const TIMEOUT_MINUTOS = 30; // 30 minutos de tolerância

export const ReservaProvider = ({ children }: { children: ReactNode }) => {
  const { criarComanda, comandas } = useComanda();
  const [reservas, setReservas] = useState<Reserva[]>(() => {
    // Carregar reservas do localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((r: any) => ({
          ...r,
          dataReserva: new Date(r.dataReserva),
          dataCriacao: new Date(r.dataCriacao),
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    }
    return [];
  });

  // Salvar reservas no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
    } catch (error) {
      console.error("Erro ao salvar reservas:", error);
    }
  }, [reservas]);

  // Criar reserva e comanda automaticamente
  const criarReserva = (dados: Omit<Reserva, "id" | "dataCriacao" | "status" | "comandaId">): string => {
    const novaReserva: Reserva = {
      id: `reserva-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...dados,
      status: "pendente",
      dataCriacao: new Date(),
    };

    // Criar comanda automaticamente para a reserva
    const comandaId = criarComanda(dados.nomeCliente);
    novaReserva.comandaId = comandaId;
    novaReserva.status = "confirmada";

    setReservas((prev) => [...prev, novaReserva]);
    return novaReserva.id;
  };

  // Cancelar reserva
  const cancelarReserva = (reservaId: string) => {
    setReservas((prev) =>
      prev.map((reserva) =>
        reserva.id === reservaId
          ? { ...reserva, status: "cancelada" as const }
          : reserva
      )
    );
  };

  // Confirmar reserva
  const confirmarReserva = (reservaId: string) => {
    setReservas((prev) =>
      prev.map((reserva) =>
        reserva.id === reservaId
          ? { ...reserva, status: "confirmada" as const }
          : reserva
      )
    );
  };

  // Verificar se uma comanda tem itens (consumo)
  const comandaTemItens = (comandaId: string): boolean => {
    const comanda = comandas.find((c: Comanda) => c.id === comandaId);
    return comanda ? comanda.items.length > 0 : false;
  };

  // Verificar timeout de reservas (30 minutos após o horário reservado)
  const verificarTimeoutReservas = () => {
    const agora = new Date();
    
    setReservas((prev) =>
      prev.map((reserva) => {
        // Só verificar reservas confirmadas ou pendentes
        if (reserva.status !== "confirmada" && reserva.status !== "pendente") {
          return reserva;
        }

        // Verificar se a reserva já passou do horário
        const dataHoraReserva = new Date(reserva.dataReserva);
        const [hora, minuto] = reserva.horaReserva.split(":").map(Number);
        dataHoraReserva.setHours(hora, minuto, 0, 0);

        // Calcular o tempo decorrido desde o horário da reserva
        const tempoDecorrido = agora.getTime() - dataHoraReserva.getTime();
        const minutosDecorridos = tempoDecorrido / (1000 * 60);

        // Se passou mais de 30 minutos e ainda não houve consumo
        if (minutosDecorridos > TIMEOUT_MINUTOS) {
          // Verificar se há consumo (itens na comanda)
          if (reserva.comandaId && comandaTemItens(reserva.comandaId)) {
            // Se há comanda com itens, manter a reserva ativa
            return reserva;
          } else {
            // Se não há consumo, marcar como expirada
            return {
              ...reserva,
              status: "expirada" as const,
            };
          }
        }

        return reserva;
      })
    );
  };

  // Verificar timeout de reservas a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      verificarTimeoutReservas();
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(interval);
  }, [reservas, comandas]);

  // Obter reservas pendentes
  const getReservasPendentes = (): Reserva[] => {
    return reservas.filter((r) => r.status === "pendente");
  };

  // Obter reservas confirmadas
  const getReservasConfirmadas = (): Reserva[] => {
    return reservas.filter((r) => r.status === "confirmada");
  };

  return (
    <ReservaContext.Provider
      value={{
        reservas,
        criarReserva,
        cancelarReserva,
        confirmarReserva,
        getReservasPendentes,
        getReservasConfirmadas,
        verificarTimeoutReservas,
      }}
    >
      {children}
    </ReservaContext.Provider>
  );
};

export const useReserva = () => {
  const context = useContext(ReservaContext);
  if (context === undefined) {
    throw new Error("useReserva must be used within a ReservaProvider");
  }
  return context;
};

