// Dashboard.js
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
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Home.css";

const localizer = momentLocalizer(moment);

const Home = () => {
  const [numClientes, setNumClientes] = useState(0);
  const [numFuncionarios, setNumFuncionarios] = useState(0);
  const [numServicos, setNumServicos] = useState(0);
  const [numAgendamentos, setNumAgendamentos] = useState(0);
  const [agendaHoje, setAgendaHoje] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]); // Armazena agendamentos do backend

  const navigate = useNavigate();

  const fetchAgendamentos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/agendamentos");
      const agendamentos = response.data?.map((agendamento) => ({
        title: ` ${agendamento?.nome_cliente} - ${agendamento?.nome_servico}`,
        start: new Date(agendamento?.data_agendamento), // Formatação correta
        end: new Date(agendamento?.data_final_agendamento),
        agendamento,
      }));
      setEvents(agendamentos);
    } catch (error) {
      console.error("Erro ao buscar agendamentos: ", error);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  // Função para buscar as métricas do backend
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
      setNumAgendamentos(agendamentosRes.data.length);

      const today = new Date().toISOString().split("T")[0];
      const agendaHojeData = agendamentosRes.data.filter(
        (agendamento) => agendamento.data_agendamento === today
      );

      // Transformar agendamentos em formato compatível com react-big-calendar
      const events = agendaHojeData.map((agendamento) => ({
        title: `${agendamento.cliente_nome} - ${agendamento.servico_nome}`,
        start: new Date(
          `${agendamento.data_agendamento}T${agendamento.hora_agendamento}`
        ),
        end: new Date(
          `${agendamento.data_agendamento}T${agendamento.hora_agendamento}`
        ),
        allDay: false,
      }));

      setAgendaHoje(events);
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
    <div className="dashboard-container">
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Box
        flexDirection="row"
        display="flex"
        justifyContent="space-evenly"
        paddingBottom="24px"
      >
        {/* Card de Clientes */}
        <Paper elevation={3} className="dashboard-card">
          <Typography variant="h6" gutterBottom>
            Clientes
          </Typography>
          <Typography variant="h4" color="primary">
            {numClientes}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/clientes")}
            style={{ margin: "10px" }}
          >
            Ver Clientes
          </Button>
        </Paper>

        {/* Card de Funcionários */}
        <Paper elevation={3} className="dashboard-card">
          <Typography variant="h6" gutterBottom>
            Funcionários
          </Typography>
          <Typography variant="h4" color="primary">
            {numFuncionarios}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/funcionarios")}
            style={{ margin: "10px" }}
          >
            Ver Funcionários
          </Button>
        </Paper>

        {/* Card de Serviços */}
        <Paper elevation={3} className="dashboard-card">
          <Typography variant="h6" gutterBottom>
            Serviços
          </Typography>
          <Typography variant="h4" color="primary">
            {numServicos}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/servicos")}
            style={{ margin: "10px" }}
          >
            Ver Serviços
          </Button>
        </Paper>
      </Box>

      {/* Agenda do Dia com react-big-calendar */}
      <Grid item xs={12}>
        <Paper elevation={3} className="dashboard-card">
          <Typography variant="h6" gutterBottom>
            Agenda do Dia
          </Typography>
          <Calendar
            localizer={localizer}
            events={events} // Mostra os eventos no calendário
            selectable // Permite selecionar um horário // Ação ao selecionar um horário
            defaultView="agenda"
            startAccessor="start"
            endAccessor="end"
            min={new Date().setHours(8, 0, 0)}
            max={new Date().setHours(18, 0, 0)}
            style={{ height: 400, margin: "20px 0" }}
          />
        </Paper>
      </Grid>
    </div>
  );
};

export default Home;
