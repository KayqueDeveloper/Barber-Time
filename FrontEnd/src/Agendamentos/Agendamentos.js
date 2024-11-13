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
} from "@mui/material";
import dayjs from "dayjs"; // Usaremos dayjs para trabalhar com as datas no form

import * as S from "./Agendamentos.style";

const localizer = momentLocalizer(moment);

const Status = ["pendente", "concluido", "em andamento"];

const CalendarComponent = () => {
  const [events, setEvents] = useState([]); // Armazena agendamentos do backend
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servico, setServico] = useState("");
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // Controle do modal
  const [selectedSlot, setSelectedSlot] = useState(null); // Horário selecionado
  const [cliente, setCliente] = useState(""); // Dados do cliente no agendamento
  const [funcionario, setFuncionario] = useState(""); // Dados do funcionário
  const [error, setError] = useState("");
  const [verAgendamento, setVerAgendamento] = useState(false);
  const [agendamento, setAgendamento] = useState("");
  const [slot, setSlot] = useState({});

  // Função para buscar agendamentos do backend
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
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/clientes");
        setClientes(response?.data.clientes);
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
        setServicos(response?.data?.servicos);
      } catch (error) {
        setError("Erro ao buscar serviços");
      }
    };

    fetchServicos();
  }, []);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const response = await axios.get("http://localhost:8080/funcionarios");
        setFuncionarios(response?.data.funcionarios);
      } catch (error) {
        setError("Erro ao buscar funcionários");
      }
    };

    fetchFuncionarios();
  }, []);

  // Função para abrir o modal e marcar um agendamento
  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setModalOpen(true);
  };

  const handleClickEvent = useCallback((event) => {
    setAgendamento(event?.agendamento);
    setVerAgendamento(true);
  }, []);

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSlot(null);
    setCliente("");
    setFuncionario("");
    setServico("");
  };

  const handleCloseVerAgendamento = () => {
    setVerAgendamento(false);
    setAgendamento("");
  };

  const getFuncionario = useCallback(() => {
    const func = funcionarios?.filter(
      (funcionario) => funcionario?.id === agendamento?.funcionario_id
    );

    return func?.[0]?.nome;
  }, [agendamento?.funcionario_id, funcionarios]);

  // Função para confirmar o agendamento
  const handleConfirmAgendamento = async () => {
    const dataFinal = new Date(selectedSlot?.start);
    dataFinal?.setMinutes(dataFinal?.getMinutes() + servico?.duracao);
    console.log(slot);

    try {
      await axios.post("http://localhost:8080/agendamentos", {
        cliente_id: cliente,
        funcionario_id: funcionario,
        servico_id: servico?.id,
        status,
        data_agendamento: new Date(selectedSlot.start).toISOString(),
        data_final_agendamento: dataFinal.toISOString(),
      });

      fetchAgendamentos(); // Atualiza a lista de agendamentos
      handleCloseModal(); // Fecha o modal após confirmação
    } catch (error) {
      console.error("Erro ao agendar: ", error);
    }
  };

  const handleUpdateAgendamento = async (status) => {
    try {
      await axios.put(`http://localhost:8080/agendamentos/${agendamento.id}`, {
        ...agendamento,
        status: status,
      });
      fetchAgendamentos(); // Atualiza a lista de agendamentos
      handleCloseVerAgendamento(); // Fecha o modal após confirmaç
    } catch (error) {
      console.error("Erro ao mudar status: ", error);
    }
  };

  const handleDeleteAgendamento = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/agendamentos/${agendamento.id}`
      );
      fetchAgendamentos(); // Atualiza a lista de agendamentos
      handleCloseVerAgendamento(); // Fecha o modal após confirmaç
    } catch (error) {
      console.error("Erro ao deletar: ", error);
    }
  };

  // Chamar a função para buscar agendamentos quando o componente é montado
  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const handleChangeCliente = (event) => {
    setCliente(event?.target?.value);
  };

  const handleChangeFuncionario = (event) => {
    const eventosFuncionario = events.filter((agendamento) => {
      return agendamento?.agendamento?.funcionario_id === event.target.value;
    });

    const isDateConflicting = eventosFuncionario.some((element) => {
      const selectedDate = new Date(selectedSlot.start).getTime();
      const agendamentoDate = new Date(
        element?.agendamento?.data_agendamento
      ).getTime();
      return selectedDate === agendamentoDate;
    });

    if (isDateConflicting) {
      console.log("Conflito: a data selecionada já está ocupada.");
    } else {
      console.log("A data selecionada está disponível.");
      setFuncionario(event?.target?.value);
    }
  };

  const handleChangeServico = (event) => {
    setServico(event?.target?.value);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Agendamento de Barbearia
      </Typography>

      {/* Calendário */}
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
        style={{ height: 700, margin: "50px" }}
      />

      {/* Modal para Confirmar Agendamento */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <S.ModalStyle>
          <Typography variant="h6" gutterBottom>
            Confirmar Agendamento
          </Typography>
          <S.formulario>
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
                  <MenuItem value={client?.id}>{client?.nome}</MenuItem>
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
                value={servico}
                label="Serviço"
                onChange={handleChangeServico}
              >
                {servicos?.map((servico, _) => (
                  <MenuItem value={servico}>{servico?.nome}</MenuItem>
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
              Funcionario: {getFuncionario(funcionarios)}
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

export default CalendarComponent;
