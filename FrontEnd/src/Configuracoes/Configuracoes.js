// Configuracoes.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import "./Configuracoes.css";

const Configuracoes = () => {
  const [horarioAbertura, setHorarioAbertura] = useState("");
  const [horarioFechamento, setHorarioFechamento] = useState("");
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Função para buscar as configurações do backend
  const fetchConfiguracoes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/configuracoes");
      const { horario_abertura, horario_fechamento, notificacoes_ativas } = response.data;
      setHorarioAbertura(horario_abertura);
      setHorarioFechamento(horario_fechamento);
      setNotificacoesAtivas(notificacoes_ativas);
      setLoading(false);
    } catch (error) {
      setError("Erro ao buscar configurações");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  // Função para salvar as configurações no backend
  const salvarConfiguracoes = async () => {
    try {
      await axios.put("http://localhost:8080/configuracoes", {
        horario_abertura: horarioAbertura,
        horario_fechamento: horarioFechamento,
        notificacoes_ativas: notificacoesAtivas,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Mensagem de sucesso por 3 segundos
    } catch (error) {
      setError("Erro ao salvar configurações");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="configuracoes-container">
      <Paper elevation={3} className="configuracoes-form">
        <Typography variant="h4" gutterBottom>
          Configurações
        </Typography>

        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="primary">Configurações salvas com sucesso!</Typography>}

        {/* Campo para horário de abertura */}
        <TextField
          fullWidth
          label="Horário de Abertura"
          type="time"
          value={horarioAbertura}
          onChange={(e) => setHorarioAbertura(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Campo para horário de fechamento */}
        <TextField
          fullWidth
          label="Horário de Fechamento"
          type="time"
          value={horarioFechamento}
          onChange={(e) => setHorarioFechamento(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Switch para notificações */}
        <FormControlLabel
          control={
            <Switch
              checked={notificacoesAtivas}
              onChange={(e) => setNotificacoesAtivas(e.target.checked)}
              color="primary"
            />
          }
          label="Notificações Ativas"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={salvarConfiguracoes}
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Salvar Configurações
        </Button>
      </Paper>
    </div>
  );
};

export default Configuracoes;
