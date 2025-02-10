
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define el tipo de los datos del contexto
interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Define el tipo de props para AuthProvider, que debe aceptar children
interface AuthProviderProps {
  children: ReactNode; // Esto asegura que se puedan pasar cualquier tipo de hijos al componente
}

const defaultState: AuthContextType = {
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultState);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    }
  }, []);

  const fetchUserData = async (jwt: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/me", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setToken(data.access_token);
      localStorage.setItem("token", data.access_token);
      fetchUserData(data.access_token);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // Asegúrate de devolver JSX correctamente
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
