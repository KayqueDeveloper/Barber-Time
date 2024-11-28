import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./Relatorios.css";
import "chart.js/auto";
import { useRelatorios } from "./Relatorios.data.ts";

const Relatorios: React.FC = () => {
  const {
    carregando,
    relatorioRef,
    gerarPDF,
    gerarRelatorioDetalhado,
    dataServicosMaisPopulares,
    dataAgendamentosPorMes,
    opcoes,
    dataFuncionariosMaisAtivos,
    dataFaturamento,
    snackbarSeverity,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
  } = useRelatorios();

  if (carregando) {
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

  return (
    <div className="relatorios-container" ref={relatorioRef}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Tempo em milissegundos para desaparecer
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Typography variant="h4" gutterBottom>
        Relatórios
      </Typography>

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
            <Button
              variant="outlined"
              onClick={() => gerarRelatorioDetalhado("agendamentos")}
              style={{ marginTop: "10px" }}
            >
              Gerar Relatório Detalhado
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="relatorio-card">
            <Typography variant="h6" gutterBottom>
              Serviços Mais Solicitados
            </Typography>
            <Pie
              data={dataServicosMaisPopulares}
              options={opcoes}
              plugins={[ChartDataLabels]}
            />
            <Button
              variant="outlined"
              onClick={() => gerarRelatorioDetalhado("servicos")}
              style={{ marginTop: "10px" }}
            >
              Gerar Relatório Detalhado
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="relatorio-card">
            <Typography variant="h6" gutterBottom>
              Funcionários Mais Ativos
            </Typography>
            <Line data={dataFuncionariosMaisAtivos} />
            <Button
              variant="outlined"
              onClick={() => gerarRelatorioDetalhado("funcionarios")}
              style={{ marginTop: "10px" }}
            >
              Gerar Relatório Detalhado
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="relatorio-card">
            <Typography variant="h6" gutterBottom>
              Faturamento por Mês
            </Typography>
            <Bar data={dataFaturamento} />
            <Button
              variant="outlined"
              onClick={() => gerarRelatorioDetalhado("faturamento")}
              style={{ marginTop: "10px" }}
            >
              Gerar Relatório Detalhado
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Relatorios;
