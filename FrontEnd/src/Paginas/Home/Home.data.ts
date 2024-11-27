import { AlertColor } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useHome = () => {
  const [numClientes, setNumClientes] = useState(0);
  const [numFuncionarios, setNumFuncionarios] = useState(0);
  const [numServicos, setNumServicos] = useState(0);
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const navegar = useNavigate();

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const buscarMetricas = async () => {
    try {
      const [clientesRes, funcionariosRes, servicosRes, agendamentosRes] =
        await Promise.all([
          axios.get("http://localhost:8080/clientes"),
          axios.get("http://localhost:8080/funcionarios"),
          axios.get("http://localhost:8080/servicos"),
          axios.get("http://localhost:8080/agendamentos"),
        ]);

      setNumClientes(clientesRes.data.clientes.length);
      setNumFuncionarios(funcionariosRes.data.funcionarios.length);
      setNumServicos(servicosRes.data.servicos.length);

      const eventos = agendamentosRes.data?.map((agendamento) => ({
        title: ` ${agendamento?.nome_cliente} - ${agendamento?.nome_servico} (${agendamento?.nome_funcionario}) - ${agendamento?.status}`,
        start: new Date(agendamento?.data_agendamento), // Formatação correta
        end: new Date(agendamento?.data_final_agendamento),
        agendamento,
      }));

      setEventos(eventos);
      setCarregando(false);
    } catch (erro) {
      showSnackbar(
        "Erro ao buscar métricas, entre em contato com os desenvolvedores",
        "error"
      );
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarMetricas();
  }, []);

  return {
    carregando,
    numClientes,
    navegar,
    numFuncionarios,
    numServicos,
    eventos,
    snackbarSeverity,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
  };
};
