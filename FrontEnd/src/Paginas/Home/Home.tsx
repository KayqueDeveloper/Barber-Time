import React from "react";
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import BuildIcon from "@mui/icons-material/Build";
import { useHome } from "./Home.data.ts";
import * as S from "./Home.style.ts";

const localizer = momentLocalizer(moment);

const Home = () => {
  const {
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
  } = useHome();

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
    <S.DashboardContainer>
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
      <Typography variant="h4" gutterBottom align="center">
        Home
      </Typography>

      <Box display="flex" flexDirection="column" gap="20px">
        <Box
          display="flex"
          flexDirection="row"
          gap="90px"
          justifyContent="center"
        >
          <S.DashboardCard>
            <S.IconContainer>
              <PeopleIcon fontSize="large" />
            </S.IconContainer>
            <Typography variant="h6" color="white">
              Clientes
            </Typography>
            <Typography variant="h4">{numClientes}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navegar("/clientes")}
            >
              Ver Clientes
            </Button>
          </S.DashboardCard>

          <S.DashboardCard>
            <S.IconContainer>
              <WorkIcon fontSize="large" />
            </S.IconContainer>
            <Typography variant="h6" color="white">
              Funcionários
            </Typography>
            <Typography variant="h4">{numFuncionarios}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navegar("/funcionarios")}
            >
              Ver Funcionários
            </Button>
          </S.DashboardCard>

          <S.DashboardCard>
            <S.IconContainer>
              <BuildIcon fontSize="large" />
            </S.IconContainer>
            <Typography variant="h6" color="white">
              Serviços
            </Typography>
            <Typography variant="h4">{numServicos}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navegar("/servicos")}
            >
              Ver Serviços
            </Button>
          </S.DashboardCard>
        </Box>

        <S.CalendarContainer>
          <Typography variant="h6" gutterBottom>
            Agenda do Dia
          </Typography>
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            min={new Date().setHours(8, 0, 0)}
            max={new Date().setHours(18, 0, 0)}
            style={{
              height: 500,
              margin: "20px auto",
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
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
              date: "Data",
              time: "Hora",
              eventTitle: "Título do Evento",
            }}
            eventPropGetter={() => ({
              style: {
                textAlign: "left",
                gap: "16px",
                paddingBottom: "16px",
                borderRadius: "5px",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
              },
            })}
          />
        </S.CalendarContainer>
      </Box>
    </S.DashboardContainer>
  );
};

export default Home;
