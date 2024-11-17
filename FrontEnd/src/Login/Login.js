import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import logo from "../logo.png";
import fundo from "./fundo.jpg";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url(${fundo});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const LoginPaper = styled(Paper)`
  padding: 32px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  border-radius: 8px;
`;

const LoginLogo = styled.img`
  max-width: 150px;
  margin-bottom: 16px;
`;

const LoginButton = styled(Button)`
  margin-top: 16px;
  font-weight: bold;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !senha) {
      setError("Preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        senha,
      });
      if (response.status === 200) {
        // Login bem-sucedido
        navigate("/home"); // Redireciona para o Dashboard
      }
    } catch (error) {
      setError("Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginPaper elevation={3}>
        <LoginLogo src={logo} alt="Logo" />
        <Typography variant="h5" gutterBottom>
          Bem-vindo(a)
        </Typography>
        {error && (
          <Alert severity="error" style={{ marginBottom: "16px" }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="E-mail"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            variant="outlined"
            margin="normal"
            value={senha}
            onChange={(e) => {
              console.log(e.target.value);
              setSenha(e.target.value);
            }}
          />
          <LoginButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Entrar"
            )}
          </LoginButton>
        </form>
      </LoginPaper>
    </LoginContainer>
  );
};

export default Login;
