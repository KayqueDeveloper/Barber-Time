// Agendamentos.js
import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import "./Agendamentos.css";

import * as S from "./Agendamentos.style";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [open, setOpen] = useState(false); // Estado para controlar o modal
  const [cliente, setCliente] = useState("");
  const [funcionario, setFuncionario] = useState("");
  const [servico, setServico] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState(dayjs());
  const [horaAgendamento, setHoraAgendamento] = useState("");
  const [error, setError] = useState("");

  // Função para buscar os agendamentos do backend
  const fetchAgendamentos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/agendamentos");
      setAgendamentos(response.data);
    } catch (error) {
      setError("Erro ao buscar agendamentos");
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

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

  const handleChangeCliente = (event) => {
    setCliente(event?.target?.value);
  };

  const handleChangeFuncionario = (event) => {
    setFuncionario(event?.target?.value);
  };

  const handleChangeServico = (event) => {
    setServico(event?.target?.value);
  };

  const handleChandeData = (event) => {
    setDataAgendamento(event?.target?.value);
  };

  // Função para abrir o modal
  const handleOpen = () => setOpen(true);
  // Função para fechar o modal
  const handleClose = () => setOpen(false);

  // Função para adicionar agendamento
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/agendamentos", {
        cliente_id: cliente,
        funcionario_id: funcionario,
        servico_id: servico,
        data_agendamento: dataAgendamento,
        hora_agendamento: horaAgendamento,
      });
      setAgendamentos([...agendamentos, response.data]); // Atualiza a lista de agendamentos
      handleClose(); // Fecha o modal
      setCliente("");
      setFuncionario("");
      setServico("");
      setDataAgendamento("");
      setHoraAgendamento("");
    } catch (error) {
      setError("Erro ao adicionar agendamento");
    }
  };

  // Função para remover agendamento
  const removerAgendamento = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/agendamentos/${id}`);
      setAgendamentos(
        agendamentos.filter((agendamento) => agendamento.id !== id)
      );
    } catch (error) {
      setError("Erro ao remover agendamento");
    }
  };

  const isDateTimeDisabled = (date) => {
    console.log(agendamentos);
    return agendamentos.some((agendamento) =>
      dayjs(agendamento.hora_agendamento)?.isSame(date, "minute")
    );
  };

  return (
    <div className="agendamentos-container">
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Agendamentos
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Adicionar Agendamento
      </Button>

      {/* Modal para adicionar agendamento */}
      <Modal open={open} onClose={handleClose}>
        <S.ModalStyle>
          <Typography variant="h6" component="h2">
            Adicionar Agendamento
          </Typography>
          <S.formulario onSubmit={handleSubmit}>
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Data e Hora"
                value={dataAgendamento}
                onChange={handleChandeData}
                renderInput={(params) => <TextField {...params} />}
                shouldDisableDate={(date) => isDateTimeDisabled(date)}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              label="Hora (HH:MM:SS)"
              value={horaAgendamento}
              onChange={(e) => setHoraAgendamento(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "16px" }}
            >
              Adicionar
            </Button>
          </S.formulario>
        </S.ModalStyle>
      </Modal>

      {/* Tabela de Agendamentos */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Funcionário</TableCell>
              <TableCell>Serviço</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agendamentos?.map((agendamento) => (
              <TableRow key={agendamento.id}>
                <TableCell>{agendamento.cliente_nome}</TableCell>
                <TableCell>{agendamento.funcionario_nome}</TableCell>
                <TableCell>{agendamento.servico_nome}</TableCell>
                <TableCell>{agendamento.data_agendamento}</TableCell>
                <TableCell>{agendamento.hora_agendamento}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="editar agendamento">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    aria-label="excluir agendamento"
                    onClick={() => removerAgendamento(agendamento.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Agendamentos;
