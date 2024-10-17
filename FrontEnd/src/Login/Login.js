// Login.js
import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Para redirecionamento
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook para redirecionamento

  // Função para validar e enviar as credenciais
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        senha,
      });
      if (response.status === 200) {
        // Login bem-sucedido
        navigate("/dashboard"); // Redireciona para o Dashboard
      }
    } catch (error) {
      setError("Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Paper elevation={3} className="login-paper">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleLogin}>
          {/* Campo de Email */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          {/* Campo de Senha */}
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            margin="normal"
            required
          />

          <Box mt={2}>
            {/* Botão de Login */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
