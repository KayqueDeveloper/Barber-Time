// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css"; // Estilização da tela de login

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault();

    // Validação simples de exemplo
    if (email === "" || password === "") {
      setError("Preencha todos os campos.");
      return;
    }

    // Lógica de autenticação aqui
    console.log("Email: ", email);
    console.log("Senha: ", password);

    if (email === "krh021727@gmail.com" && password === "k0203h27") {
      navigate("/dashboard")
      }

    // Limpar erro após login correto
    setError("");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
      <p className="forgot-password">
        Esqueceu sua senha? <a href="/recuperar-senha">Recuperar senha</a>
      </p>
    </div>
  );
};

export default Login;
