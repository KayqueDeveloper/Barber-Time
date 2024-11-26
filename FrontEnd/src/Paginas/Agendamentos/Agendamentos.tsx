import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";
import {
  Button,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import "moment/locale/pt-br";
import dayjs from "dayjs"; // Usaremos dayjs para trabalhar com as datas no form

import * as S from "./Agendamentos.style.ts";
import "./Agendamentos.css";
import { Agendamento, Cliente, Funcionario, Servico } from "../../Models/Tipos";

const localizer = momentLocalizer(moment);

const Status = ["pendente", "concluido", "em andamento"];

interface Event {
  title: string;
  start: Date;
  end: Date;
  agendamento: Agendamento;
}

const servicoLimpo = {
  id: 0,
  criado_em: "",
  nome: "",
  preco: 0,
  duracao: 0,
};
export const Agendamentos = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [servico, setServico] = useState<Servico>(servicoLimpo);
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>();
  const [cliente, setCliente] = useState("");
  const [funcionario, setFuncionario] = useState<number | undefined>(undefined);
  const [error, setError] = useState("");
  const [verAgendamento, setVerAgendamento] = useState(false);
  const [agendamento, setAgendamento] = useState<Agendamento>();

  // Função para buscar agendamentos do backend
  const fetchAgendamentos = async () => {
    try {
      const response = await axios.get<Agendamento[]>(
        "http://localhost:8080/agendamentos"
      );
      const agendamentos = response.data.map((agendamento) => ({
        title: ` ${agendamento.nome_cliente} - ${agendamento.nome_servico} - ${agendamento.status}`,
        start: new Date(agendamento.data_agendamento),
        end: new Date(agendamento.data_final_agendamento),
        agendamento,
      }));
      setEvents(agendamentos);
    } catch (error) {
      console.error("Erro ao buscar agendamentos: ", error);
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/clientes");
        setClientes(response.data.clientes);
      } catch (error) {
        setError("Erro ao buscar clientes");
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/servicos");
        setServicos(response.data.servicos);
      } catch (error) {
        setError("Erro ao buscar serviços");
      }
    };

    fetchServicos();
  }, []);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await axios.get<{ funcionarios: Funcionario[] }>(
          "http://localhost:8080/funcionarios",
          {
            params: {
              cargo: "barbeiro",
            },
          }
        );
        setFuncionarios(response.data.funcionarios);
      } catch (error) {
        setError("Erro ao buscar funcionários");
      }
    };

    fetchFuncionarios();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setModalOpen(true);
  };

  const handleClickEvent = useCallback((event) => {
    setAgendamento(event.agendamento as Agendamento);
    setVerAgendamento(true);
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSlot(null);
    setCliente("");
    setFuncionario(undefined);
    setServico(servicoLimpo);
    setError("");
  };

  const handleCloseVerAgendamento = () => {
    setVerAgendamento(false);
    setAgendamento(undefined);
  };

  const getFuncionario = useCallback(() => {
    const func = funcionarios.find(
      (funcionario) => funcionario?.id === agendamento?.funcionario_id
    );
    return func?.nome || "";
  }, [agendamento?.funcionario_id, funcionarios]);

  const handleConfirmAgendamento = async () => {
    if (!selectedSlot || !servico) return;

    const dataFinal = new Date(selectedSlot?.start);
    dataFinal.setMinutes(dataFinal.getMinutes() + servico?.duracao);
    console.log(dataFinal);

    try {
      await axios.post("http://localhost:8080/agendamentos", {
        cliente_id: cliente,
        funcionario_id: funcionario,
        servico_id: servico.id,
        status,
        data_agendamento: new Date(selectedSlot.start).toISOString(),
        data_final_agendamento: dataFinal.toISOString(),
      });

      fetchAgendamentos();
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao agendar: ", error);
    }
  };

  const handleUpdateAgendamento = async (status: string) => {
    if (!agendamento) return;

    try {
      await axios.put(`http://localhost:8080/agendamentos/${agendamento.id}`, {
        ...agendamento,
        status,
      });
      fetchAgendamentos();
      handleCloseVerAgendamento();
    } catch (error) {
      console.error("Erro ao mudar status: ", error);
    }
  };

  const handleDeleteAgendamento = async () => {
    if (!agendamento) return;

    try {
      await axios.delete(
        `http://localhost:8080/agendamentos/${agendamento.id}`
      );
      fetchAgendamentos();
      handleCloseVerAgendamento();
    } catch (error) {
      console.error("Erro ao deletar: ", error);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const handleChangeFuncionario = (event) => {
    const selectedFuncionario = event.target.value as number;

    const eventosFuncionario = events.filter((agendamento) =>
      agendamento?.agendamento
        ? agendamento?.agendamento?.funcionario_id === selectedFuncionario
        : false
    );

    const isDateConflicting = eventosFuncionario.some((element) => {
      const selectedDate = new Date(selectedSlot?.start || "").getTime();
      const agendamentoDate = new Date(
        element?.agendamento?.data_agendamento || ""
      ).getTime();
      return selectedDate === agendamentoDate;
    });

    if (isDateConflicting) {
      setError("Conflito: o barbeiro já está com o horário ocupado.");
      setFuncionario(undefined);
    } else {
      setError("");

      setFuncionario(selectedFuncionario);
    }
  };

  const handleChangeCliente = (event) => {
    const selectedCliente = event.target.value;

    const eventosCliente = events.filter((agendamento) =>
      agendamento?.agendamento
        ? agendamento?.agendamento?.cliente_id === selectedCliente
        : false
    );

    const isDateConflicting = eventosCliente.some((element) => {
      const selectedDate = new Date(selectedSlot?.start || "").getTime();
      const agendamentoDate = new Date(
        element?.agendamento?.data_agendamento || ""
      ).getTime();
      return selectedDate === agendamentoDate;
    });

    if (isDateConflicting) {
      setError("Conflito: o cliente já está com o horário marcado.");
      setCliente("");
    } else {
      setError("");

      setCliente(selectedCliente);
    }
  };

  const handleChangeServico = (event) => {
    const serv = servicos?.find((s) => s.id === event.target.value);
    setServico(serv as Servico);
  };

  return (
    <div className="agendamentos-container">
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
            events={events} // Mostra os eventos no calendário
            selectable // Permite selecionar um horário
            onSelectEvent={handleClickEvent}
            onSelectSlot={handleSelectSlot} // Ação ao selecionar um horário
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
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
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
                boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
              },
            })}
          />
        </S.CalendarWrapper>
      </React.Fragment>

      {/* Modal para Confirmar Agendamento */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <S.ModalStyle>
          <Typography variant="h6" gutterBottom>
            Confirmar Agendamento
          </Typography>
          {error && (
            <Alert severity="error" className="error-message">
              {error}
            </Alert>
          )}
          <S.formulario onSubmit={handleConfirmAgendamento}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Cliente</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cliente}
                label="Cliente"
                onChange={handleChangeCliente}
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
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={funcionario}
                label="Funcionario"
                onChange={handleChangeFuncionario}
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
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={servico.id}
                label="Serviço"
                onChange={handleChangeServico}
              >
                {servicos?.map((servico, _) => (
                  <MenuItem value={servico?.id}>{servico?.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
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
              {dayjs(selectedSlot?.start).format("DD/MM/YYYY HH:mm")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmAgendamento}
              fullWidth
              sx={{ mt: 2 }}
            >
              Confirmar Agendamento
            </Button>
          </S.formulario>
        </S.ModalStyle>
      </Modal>
      <Modal open={verAgendamento} onClose={handleCloseVerAgendamento}>
        <S.ModalStyle>
          <Typography variant="h6" gutterBottom>
            Vizualizar Agendamento
          </Typography>
          <S.AgendamentoDetalhes>
            <S.labels id="demo-simple-select-label">
              Cliente: {agendamento?.nome_cliente}
            </S.labels>
            <S.labels id="demo-simple-select-label">
              Funcionario: {getFuncionario()}
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
                onClick={() => handleUpdateAgendamento("em andamento")}
                fullWidth
                sx={{ mt: 2 }}
              >
                Em Andamento
              </Button>
              <Button
                id="concluido"
                variant="contained"
                color="primary"
                onClick={() => handleUpdateAgendamento("concluido")}
                fullWidth
                sx={{ mt: 2 }}
              >
                Concluído
              </Button>
              <Button
                id="concluido"
                variant="contained"
                color="error"
                onClick={handleDeleteAgendamento}
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
