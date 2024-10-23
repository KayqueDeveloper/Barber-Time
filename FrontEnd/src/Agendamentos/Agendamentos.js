import React, { useState, useEffect } from "react";
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

const CalendarComponent = () => {
  const [events, setEvents] = useState([]); // Armazena agendamentos do backend
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [servico, setServico] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // Controle do modal
  const [selectedSlot, setSelectedSlot] = useState(null); // Horário selecionado
  const [cliente, setCliente] = useState(""); // Dados do cliente no agendamento
  const [funcionario, setFuncionario] = useState(""); // Dados do funcionário
  const [error, setError] = useState("");

  // Função para buscar agendamentos do backend
  const fetchAgendamentos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/agendamentos");
      const agendamentos = response.data.map((agendamento) => ({
        title: `Agendado: Cliente ${agendamento.cliente_id}`,
        start: new Date(2024, 10, 23, 13, 0), // Formatação correta
        end: new Date(2024, 10, 23, 13, 30),
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
        setClientes(response.data);
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
        setServicos(response.data);
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
        setFuncionarios(response.data);
      } catch (error) {
        setError("Erro ao buscar funcionários");
      }
    };

    fetchFuncionarios();
  }, []);

  // Função para abrir o modal e marcar um agendamento
  const handleSelectSlot = (slotInfo) => {
    console.log(slotInfo);
    setSelectedSlot(slotInfo);
    setModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSlot(null);
    setCliente("");
    setFuncionario("");
  };

  // Função para confirmar o agendamento
  const handleConfirmAgendamento = async () => {
    try {
      await axios.post("http://localhost:8080/agendamentos", {
        cliente_id: cliente,
        funcionario_id: funcionario,
        servico_id: servico,
        data_hora: selectedSlot.start,
      });
      fetchAgendamentos(); // Atualiza a lista de agendamentos
      handleCloseModal(); // Fecha o modal após confirmação
    } catch (error) {
      console.error("Erro ao agendar: ", error);
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
    setFuncionario(event?.target?.value);
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
                {clientes.map((client, index) => (
                  <MenuItem value={client.id}>{client?.nome}</MenuItem>
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
                {funcionarios.map((funcionario, _) => (
                  <MenuItem value={funcionario.id}>
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
                {servicos.map((servico, _) => (
                  <MenuItem value={servico.id}>{servico?.nome}</MenuItem>
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
    </div>
  );
};

export default CalendarComponent;
