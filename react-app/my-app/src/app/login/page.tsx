"use client"
import React, { useState } from "react";
import "./styles.css"
import { useRouter } from "next/navigation";

const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setLoading(true);
  
      try {
        const res = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          // Guarda el token (por ejemplo en localStorage)
          localStorage.setItem("token", data.access_token);
          // Redirige a la página deseada (dashboard, home, etc.)
          router.push("/cocktails");
        } else {
          setError(data.error || "Error al iniciar sesión.");
        }
      } catch (err) {
        console.error("Error en el login:", err);
        setError("Error en el servidor. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="login-form" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    );
  };
  
  export default LoginForm;