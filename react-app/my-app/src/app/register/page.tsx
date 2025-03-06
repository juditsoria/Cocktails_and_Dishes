"use client";
import React, { useState } from "react";
import "./styles.css";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");
    setLoading(true);

    const userData = { email, username, password };

    try {
      const response = await fetch("http://localhost:5000/api/new-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuario registrado con éxito");
        router.push("/login");
      } else {
        setError(data.error || "Hubo un error al registrar el usuario.");
      }
    } catch (err) {
      setError("Error en el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page d-flex align-items-center justify-content-center">
      <div className="register-card card p-4 shadow">
        <h2 className="card-title text-center mb-4">Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo Electrónico:
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Nombre de Usuario:
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
