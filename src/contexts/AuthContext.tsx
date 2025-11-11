import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "admin" | "garcom" | "cliente";

export interface User {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: boolean;
  isGarcom: boolean;
  isCliente: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "auth_user_sabores_alfama";

// Usuários padrão para demonstração (em produção, isso viria de uma API)
const DEFAULT_USERS: { email: string; password: string; user: User }[] = [
  {
    email: "admin@saboresalfama.com",
    password: "admin123",
    user: {
      id: "1",
      email: "admin@saboresalfama.com",
      nome: "Administrador",
      role: "admin",
    },
  },
  {
    email: "garcom@saboresalfama.com",
    password: "garcom123",
    user: {
      id: "2",
      email: "garcom@saboresalfama.com",
      nome: "Garçom",
      role: "garcom",
    },
  },
  {
    email: "cliente@saboresalfama.com",
    password: "cliente123",
    user: {
      id: "3",
      email: "cliente@saboresalfama.com",
      nome: "Cliente",
      role: "cliente",
    },
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Carregar usuário do localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
    return null;
  });

  // Salvar usuário no localStorage sempre que houver mudanças
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Em produção, isso seria uma chamada à API
    // Por enquanto, vamos usar os usuários padrão
    const foundUser = DEFAULT_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser.user);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const isAdmin = hasRole("admin");
  const isGarcom = hasRole("garcom");
  const isCliente = hasRole("cliente");

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        isAdmin,
        isGarcom,
        isCliente,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

