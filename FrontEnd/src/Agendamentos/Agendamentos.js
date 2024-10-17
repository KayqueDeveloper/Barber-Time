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
  Box,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import "./Agendamentos.css";

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [open, setOpen] = useState(false); // Estado para controlar o modal
  const [cliente, setCliente] = useState("");
  const [funcionario, setFuncionario] = useState("");
  const [servico, setServico] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
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
      setAgendamentos(agendamentos.filter((agendamento) => agendamento.id !== id));
    } catch (error) {
      setError("Erro ao remover agendamento");
    }
  };

  // Estilo para o modal
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
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
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Adicionar Agendamento
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Cliente (ID)"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Funcionário (ID)"
              value={funcionario}
              onChange={(e) => setFuncionario(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Serviço (ID)"
              value={servico}
              onChange={(e) => setServico(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Data (YYYY-MM-DD)"
              value={dataAgendamento}
              onChange={(e) => setDataAgendamento(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Hora (HH:MM:SS)"
              value={horaAgendamento}
              onChange={(e) => setHoraAgendamento(e.target.value)}
              margin="normal"
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
          </form>
        </Box>
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
