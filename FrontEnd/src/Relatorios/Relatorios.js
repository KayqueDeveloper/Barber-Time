// Relatorios.js
import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import jsPDF from "jspdf";
import "./Relatorios.css";
import "chart.js/auto"; // Import necessário para o Chart.js

const Relatorios = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agendamentosPorMes, setAgendamentosPorMes] = useState([]);
  const [servicosMaisPopulares, setServicosMaisPopulares] = useState([]);
  const [funcionariosMaisAtivos, setFuncionariosMaisAtivos] = useState([]);
  const [faturamento, setFaturamento] = useState([]); // Novo estado para o faturamento

  const relatorioRef = useRef();

  // Função para buscar os dados dos relatórios do backend
  const fetchRelatorios = async () => {
    try {
      const [agendamentosRes, servicosRes, funcionariosRes, faturamentoRes] =
        await Promise.all([
          axios.get("http://localhost:8080/relatorios/agendamentos-por-mes"),
          axios.get("http://localhost:8080/relatorios/servicos-mais-populares"),
          axios.get(
            "http://localhost:8080/relatorios/funcionarios-mais-ativos"
          ),
          axios.get("http://localhost:8080/relatorios/faturamento-mes"), // Novo endpoint
        ]);

      setAgendamentosPorMes(agendamentosRes.data);
      setServicosMaisPopulares(servicosRes.data);
      setFuncionariosMaisAtivos(funcionariosRes.data);
      setFaturamento(faturamentoRes.data); // Salvar dados de faturamento
      setLoading(false);
    } catch (error) {
      setError("Erro ao buscar relatórios");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatorios();
  }, []);

  const gerarPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const input = relatorioRef.current;

    // Renderiza o conteúdo em PDF
    pdf.html(input, {
      callback: (doc) => {
        doc.save("relatorios.pdf");
      },
      autoPaging: true, // Ativa paginação automática
      x: 10,
      y: 10,
      html2canvas: {
        scale: 0.8, // Reduz a escala para caber no PDF
        backgroundColor: "#ffffff", // Remove o background
        ignoreElements: (element) => element.classList.contains("ignore-pdf"), // Ignora elementos específicos
      },
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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

  const options = {
    plugins: {
      datalabels: {
        color: "#000",
        font: {
          size: 14,
        },
        formatter: (value, context) => value, // Exibir os valores diretamente
        anchor: "end",
        align: "start",
      },
    },
  };

  const dataFuncionariosMaisAtivos = {
    labels: funcionariosMaisAtivos?.map((funcionario) => funcionario.nome),
    datasets: [
      {
        label: "Funcionários Mais Ativos",
        data: funcionariosMaisAtivos?.map(
          (funcionario) => funcionario.agendamentos
        ),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const dataFaturamento = {
    labels: faturamento?.map((item) => item.mes),
    datasets: [
      {
        label: "Faturamento (R$)",
        data: faturamento?.map((item) => item.valor),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="relatorios-container" ref={relatorioRef}>
      <Typography variant="h4" gutterBottom>
        Relatórios
      </Typography>

      {error && (
        <Alert severity="error" className="error-message">
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="secondary"
        onClick={gerarPDF}
        style={{ marginBottom: "20px" }}
      >
        Gerar PDF
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="relatorio-card">
            <Typography variant="h6" gutterBottom>
              Agendamentos por Mês
            </Typography>
            <Bar data={dataAgendamentosPorMes} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="relatorio-card" height="299px">
            <Typography variant="h6" gutterBottom>
              Serviços Mais Solicitados
            </Typography>
            <Pie
              data={dataServicosMaisPopulares}
              options={options}
              plugins={[ChartDataLabels]}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="relatorio-card">
            <Typography variant="h6" gutterBottom>
              Funcionários Mais Ativos
            </Typography>
            <Line data={dataFuncionariosMaisAtivos} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="relatorio-card">
            <Typography variant="h6" gutterBottom>
              Faturamento por Mês
            </Typography>
            <Bar data={dataFaturamento} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Relatorios;
