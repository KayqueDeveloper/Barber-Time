import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import axios from "axios";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styled from "styled-components";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import BuildIcon from "@mui/icons-material/Build";

// Define os estilos do Dashboard
const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: white;
  min-height: 100vh;
  padding: 24px;
`;

const DashboardCard = styled(Paper)`
  text-align: center;
  padding: 24px;
  border-radius: 12px;
  background: white;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const IconContainer = styled.div`
  background-color: #2575fc;
  color: white;
  padding: 16px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const CalendarContainer = styled(Paper)`
  margin-top: 32px;
  padding: 24px;
  border-radius: 12px;
  background: white;
  color: #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// Configura o moment.js para usar o idioma português
const localizer = momentLocalizer(moment); // Inicializa o localizador com o moment

const Home = () => {
  const [numClientes, setNumClientes] = useState(0);
  const [numFuncionarios, setNumFuncionarios] = useState(0);
  const [numServicos, setNumServicos] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchMetrics = async () => {
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

      const events = agendamentosRes.data?.map((agendamento) => ({
        title: ` ${agendamento?.nome_cliente} - ${agendamento?.nome_servico}`,
        start: new Date(agendamento?.data_agendamento), // Formatação correta
        end: new Date(agendamento?.data_final_agendamento),
        agendamento,
      }));

      setEvents(events);
      setLoading(false);
    } catch (error) {
      setError("Erro ao buscar métricas");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

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

  return (
    <DashboardContainer>
      <Typography variant="h4" gutterBottom align="center">
        Home
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <PeopleIcon fontSize="large" />
            </IconContainer>
            <Typography variant="h6">Clientes</Typography>
            <Typography variant="h4">{numClientes}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/clientes")}
            >
              Ver Clientes
            </Button>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <WorkIcon fontSize="large" />
            </IconContainer>
            <Typography variant="h6">Funcionários</Typography>
            <Typography variant="h4">{numFuncionarios}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/funcionarios")}
            >
              Ver Funcionários
            </Button>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <BuildIcon fontSize="large" />
            </IconContainer>
            <Typography variant="h6">Serviços</Typography>
            <Typography variant="h4">{numServicos}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/servicos")}
            >
              Ver Serviços
            </Button>
          </DashboardCard>
        </Grid>

        <Grid item xs={12}>
          <CalendarContainer>
            <Typography variant="h6" gutterBottom>
              Agenda do Dia
            </Typography>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              defaultView="agenda"
              messages={{
                today: "Hoje",
                previous: "Anterior",
                next: "Próximo",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                noEventsInRange: "Nenhum evento neste período.",
                event: "Evento",
                allDay: "Dia inteiro",
                moreEvents: "Mais eventos",
              }}
            />
          </CalendarContainer>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Home;
