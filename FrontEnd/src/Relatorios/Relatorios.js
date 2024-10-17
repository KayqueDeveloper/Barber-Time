// Relatorios.js
import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Relatorios.css";
import 'chart.js/auto'; // Import necessário para o Chart.js

const Relatorios = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agendamentosPorMes, setAgendamentosPorMes] = useState([]);
  const [servicosMaisPopulares, setServicosMaisPopulares] = useState([]);
  const [funcionariosMaisAtivos, setFuncionariosMaisAtivos] = useState([]);

  const relatorioRef = useRef(); // Referência para o conteúdo da página

  // Função para buscar os dados dos relatórios do backend
  const fetchRelatorios = async () => {
    try {
      const [agendamentosRes, servicosRes, funcionariosRes] = await Promise.all([
        axios.get("http://localhost:8080/relatorios/agendamentos-por-mes"),
        axios.get("http://localhost:8080/relatorios/servicos-mais-populares"),
        axios.get("http://localhost:8080/relatorios/funcionarios-mais-ativos"),
      ]);

      setAgendamentosPorMes(agendamentosRes.data);
      setServicosMaisPopulares(servicosRes.data);
      setFuncionariosMaisAtivos(funcionariosRes.data);
      setLoading(false);
    } catch (error) {
      setError("Erro ao buscar relatórios");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorios();
  }, []);

  // Função para gerar PDF
  const gerarPDF = () => {
    const input = relatorioRef.current; // Elemento da página que queremos capturar
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("relatorio.pdf");
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // Dados para os gráficos
  const dataAgendamentosPorMes = {
    labels: agendamentosPorMes?.map((item) => item.mes),
    datasets: [
      {
        label: "Agendamentos por Mês",
        data: agendamentosPorMes?.map((item) => item.quantidade),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const dataServicosMaisPopulares = {
    labels: servicosMaisPopulares?.map((servico) => servico.nome),
    datasets: [
      {
        label: "Serviços Mais Solicitados",
        data: servicosMaisPopulares?.map((servico) => servico.quantidade),
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

  const dataFuncionariosMaisAtivos = {
    labels: funcionariosMaisAtivos?.map((funcionario) => funcionario.nome),
    datasets: [
      {
        label: "Funcionários Mais Ativos",
        data: funcionariosMaisAtivos?.map((funcionario) => funcionario.agendamentos),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="relatorios-container" ref={relatorioRef}>
      <Typography variant="h4" gutterBottom>
        Relatórios
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      {/* Botão para gerar PDF */}
      <Button variant="contained" color="secondary" onClick={gerarPDF} style={{ marginBottom: "20px" }}>
        Gerar PDF
      </Button>

      <Grid container spacing={3}>
        {/* Gráfico de Agendamentos por Mês */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="relatorio-card">
            <Typography variant="h6" gutterBottom>
              Agendamentos por Mês
            </Typography>
            <Bar data={dataAgendamentosPorMes} />
          </Paper>
        </Grid>

        {/* Gráfico de Serviços Mais Solicitados */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="relatorio-card">
            <Typography variant="h6" gutterBottom>
              Serviços Mais Solicitados
            </Typography>
            <Pie data={dataServicosMaisPopulares} />
          </Paper>
        </Grid>

        {/* Gráfico de Funcionários Mais Ativos */}
        <Grid item xs={12}>
          <Paper elevation={3} className="relatorio-card">
            <Typography variant="h6" gutterBottom>
              Funcionários Mais Ativos
            </Typography>
            <Line data={dataFuncionariosMaisAtivos} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Relatorios;
