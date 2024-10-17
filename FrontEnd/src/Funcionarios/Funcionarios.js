// Funcionarios.js
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
import "./Funcionarios.css";

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [open, setOpen] = useState(false); // Estado para controlar o modal
  const [nome, setNome] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");

  // Buscar funcionários do backend quando o componente é montado
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

  // Função para abrir o modal
  const handleOpen = () => setOpen(true);
  // Função para fechar o modal
  const handleClose = () => setOpen(false);

  // Função para adicionar funcionário
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/funcionarios", {
        nome,
        especialidade,
        telefone,
      });
      setFuncionarios([...funcionarios, response.data]); // Atualizar a lista de funcionários
      handleClose(); // Fechar o modal
      setNome("");
      setEspecialidade("");
      setTelefone("");
    } catch (error) {
      setError("Erro ao adicionar funcionário");
    }
  };

  // Função para remover funcionário
  const removerFuncionario = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/funcionarios/${id}`);
      setFuncionarios(funcionarios.filter((funcionario) => funcionario.id !== id));
    } catch (error) {
      setError("Erro ao remover funcionário");
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
    <div className="funcionarios-container">
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Funcionários
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Adicionar Funcionário
      </Button>

      {/* Modal para adicionar funcionário */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Adicionar Funcionário
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Especialidade"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
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

      {/* Tabela de Funcionários */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Especialidade</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funcionarios.map((funcionario) => (
              <TableRow key={funcionario.id}>
                <TableCell>{funcionario.nome}</TableCell>
                <TableCell>{funcionario.especialidade}</TableCell>
                <TableCell>{funcionario.telefone}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="editar funcionário">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    aria-label="excluir funcionário"
                    onClick={() => removerFuncionario(funcionario.id)}
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

export default Funcionarios;
