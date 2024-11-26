import React from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  Button,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Snackbar,
} from "@mui/material";
import "moment/locale/pt-br";
import dayjs from "dayjs"; // Usaremos dayjs para trabalhar com as datas no form

import * as S from "./Agendamentos.style.ts";
import "./Agendamentos.css";
import { useAgendamentos } from "./Agendamentos.data.ts";

export const Agendamentos = () => {
  const {
    localizer,
    Status,
    eventos,
    verEvento,
    selecaoDeSlot,
    verModal,
    fecharModal,
    confirmarAgendamento,
    cliente,
    alterarCliente,
    clientes,
    funcionario,
    alterarFuncionario,
    funcionarios,
    servico,
    alterarServico,
    servicos,
    status,
    setStatus,
    slotSelecionado,
    verAgendamento,
    fecharModalAgendamento,
    agendamento,
    atualizarAgendamento,
    deloetarAgendamento,
    acharFuncionario,
    carregando,
    snackbarMessage,
    snackbarOpen,
    snackbarSeverity,
    setSnackbarOpen,
  } = useAgendamentos();

  return (
    <div className="agendamentos-container">
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

      {carregando ? (
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
      ) : (
        <React.Fragment>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            style={{ marginBottom: "20px", color: "white" }}
          >
            Agendamento de Barbearia
          </Typography>

          <S.CalendarWrapper>
            <Calendar
              localizer={localizer}
              events={eventos} // Mostra os eventos no calendário
              selectable // Permite selecionar um horário
              onSelectEvent={verEvento}
              onSelectSlot={selecaoDeSlot} // Ação ao selecionar um horário
              defaultView="day"
              startAccessor="start"
              endAccessor="end"
              min={new Date().setHours(8, 0, 0)}
              max={new Date().setHours(18, 0, 0)}
              style={{
                height: 700,
                margin: "20px auto",
                padding: "10px",
                background: "#f8f9fa",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
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
                  textAlign: "left", // Ou "center" para centralizar
                  gap: "16px",
                  paddingBottom: "16px",
                  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
                  borderRadius: "5px",
                  color: "white",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                },
              })}
            />
          </S.CalendarWrapper>
        </React.Fragment>
      )}

      {/* Modal para Confirmar Agendamento */}
      <Modal open={verModal} onClose={fecharModal}>
        <S.ModalStyle>
          <Typography variant="h6" gutterBottom>
            Confirmar Agendamento
          </Typography>
          <Alert severity="info" className="error-message">
            Todos os campos são obrigatórios
          </Alert>
          <S.formulario onSubmit={confirmarAgendamento}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Cliente</InputLabel>
              <Select
                required
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cliente}
                label="Cliente"
                onChange={alterarCliente}
              >
                {clientes?.map((client, _) => (
                  <MenuItem value={client?.id}>
                    {client?.nome} - {client?.cpf}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Funcionario</InputLabel>
              <Select
                required
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={funcionario}
                label="Funcionario"
                onChange={alterarFuncionario}
              >
                {funcionarios?.map((funcionario, _) => (
                  <MenuItem value={funcionario?.id}>
                    {funcionario?.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Serviço</InputLabel>
              <Select
                required
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={servico.id}
                label="Serviço"
                onChange={alterarServico}
              >
                {servicos?.map((servico, _) => (
                  <MenuItem value={servico?.id}>{servico?.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                required
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Status"
                onChange={(event) => setStatus(event?.target?.value)}
              >
                {Status?.map((servico, _) => (
                  <MenuItem value={servico}>{servico}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography gutterBottom>
              Horário Selecionado:{" "}
              {dayjs(slotSelecionado?.start).format("DD/MM/YYYY HH:mm")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={confirmarAgendamento}
              fullWidth
              sx={{ mt: 2 }}
            >
              Confirmar Agendamento
            </Button>
          </S.formulario>
        </S.ModalStyle>
      </Modal>
      <Modal open={verAgendamento} onClose={fecharModalAgendamento}>
        <S.ModalStyle>
          <Typography variant="h6" gutterBottom>
            Vizualizar Agendamento
          </Typography>
          <S.AgendamentoDetalhes>
            <S.labels id="demo-simple-select-label">
              Cliente: {agendamento?.nome_cliente}
            </S.labels>
            <S.labels id="demo-simple-select-label">
              Funcionario: {acharFuncionario()}
            </S.labels>
            <S.labels id="demo-simple-select-label">
              Serviço: {agendamento?.nome_servico}
            </S.labels>
            <S.labels id="demo-simple-select-label">
              Status: {agendamento?.status}
            </S.labels>
            <Typography gutterBottom>
              Horário de inicio:{" "}
              {dayjs(agendamento?.data_agendamento).format("DD/MM/YYYY HH:mm")}
            </Typography>
            <Typography gutterBottom>
              Horário de termino:{" "}
              {dayjs(agendamento?.data_final_agendamento).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Typography>
            <S.BotoesModal>
              <Button
                id="em andamento-select-btn"
                variant="contained"
                color="secondary"
                onClick={() => atualizarAgendamento("em andamento")}
                fullWidth
                sx={{ mt: 2 }}
              >
                Em Andamento
              </Button>
              <Button
                id="concluido"
                variant="contained"
                color="primary"
                onClick={() => atualizarAgendamento("concluido")}
                fullWidth
                sx={{ mt: 2 }}
              >
                Concluído
              </Button>
              <Button
                id="concluido"
                variant="contained"
                color="error"
                onClick={deloetarAgendamento}
                fullWidth
                sx={{ mt: 2 }}
              >
                deletar
              </Button>
            </S.BotoesModal>
          </S.AgendamentoDetalhes>
        </S.ModalStyle>
      </Modal>
    </div>
  );
};
