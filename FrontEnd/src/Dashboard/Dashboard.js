// Dashboard.js
import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Line, Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import "./Dashboard.css";
import 'chart.js/auto'; // Import necessário para o Chart.js

const Dashboard = () => {
  const [numClientes, setNumClientes] = useState(0);
  const [numFuncionarios, setNumFuncionarios] = useState(0);
  const [numServicos, setNumServicos] = useState(0);
  const [numAgendamentos, setNumAgendamentos] = useState(0);
  const [agendaHoje, setAgendaHoje] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Função para buscar as métricas do backend
  const fetchMetrics = async () => {
    try {
      const [clientesRes, funcionariosRes, servicosRes, agendamentosRes] = await Promise.all([
        axios.get("http://localhost:8080/clientes"),
        axios.get("http://localhost:8080/funcionarios"),
        axios.get("http://localhost:8080/servicos"),
        axios.get("http://localhost:8080/agendamentos"),
      ]);

      setNumClientes(clientesRes.data.length);
      setNumFuncionarios(funcionariosRes.data.length);
      setNumServicos(servicosRes.data.length);
      setNumAgendamentos(agendamentosRes.data.length);
      setAgendaHoje(agendamentosRes.data.filter((agendamento) =>
        agendamento.data_agendamento === new Date().toISOString().split("T")[0]
      )); // Filtrar agendamentos do dia
      setLoading(false);
    } catch (error) {
      setError("Erro ao buscar métricas");
      setLoading(false);
    }
  };

  // useEffect para buscar métricas quando o componente é montado
  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Dados para os gráficos
  const dataClientesPorMes = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    datasets: [
      {
        label: "Clientes por Mês",
        data: [12, 19, 3, 5, 2, 3, 20, 10, 15, 18, 25, 30], // Exemplo de dados
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const dataServicosMaisPopulares = {
    labels: ["Corte", "Barba", "Tintura", "Hidratação", "Alisamento"],
    datasets: [
      {
        label: "Serviços Mais Populares",
        data: [50, 30, 10, 40, 15], // Exemplo de dados
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {/* Card de Clientes */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} className="dashboard-card">
            <Typography variant="h6" gutterBottom>
              Clientes
            </Typography>
            <Typography variant="h4" color="primary">
              {numClientes}
            </Typography>
          </Paper>
        </Grid>

        {/* Card de Funcionários */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} className="dashboard-card">
            <Typography variant="h6" gutterBottom>
              Funcionários
            </Typography>
            <Typography variant="h4" color="primary">
              {numFuncionarios}
            </Typography>
          </Paper>
        </Grid>

        {/* Card de Serviços */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} className="dashboard-card">
            <Typography variant="h6" gutterBottom>
              Serviços
            </Typography>
            <Typography variant="h4" color="primary">
              {numServicos}
            </Typography>
          </Paper>
        </Grid>

        {/* Card de Agendamentos */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} className="dashboard-card">
            <Typography variant="h6" gutterBottom>
              Agendamentos
            </Typography>
            <Typography variant="h4" color="primary">
              {numAgendamentos}
            </Typography>
          </Paper>
        </Grid>

        {/* Gráfico de Clientes por Mês */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="dashboard-card">
            <Typography variant="h6" gutterBottom>
              Clientes por Mês
            </Typography>
            <Line data={dataClientesPorMes} />
          </Paper>
        </Grid>

        {/* Gráfico de Serviços Mais Populares */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="dashboard-card">
            <Typography variant="h6" gutterBottom>
              Serviços Mais Populares
            </Typography>
            <Pie data={dataServicosMaisPopulares} />
          </Paper>
        </Grid>

        {/* Agenda do Dia */}
        <Grid item xs={12}>
          <Paper elevation={3} className="dashboard-card">
            <Typography variant="h6" gutterBottom>
              Agenda do Dia
            </Typography>
            {agendaHoje.length === 0 ? (
              <Typography color="textSecondary">Nenhum agendamento para hoje.</Typography>
            ) : (
              <ul>
                {agendaHoje.map((agendamento) => (
                  <li key={agendamento.id}>
                    {agendamento.hora_agendamento} - {agendamento.cliente_nome} ({agendamento.servico_nome})
                  </li>
                ))}
              </ul>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
