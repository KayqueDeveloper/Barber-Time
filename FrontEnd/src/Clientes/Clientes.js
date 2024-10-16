// Clientes.js
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
import "./Clientes.css";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false); // Estado para controlar o modal
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

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

  // Função para abrir o modal
  const handleOpen = () => setOpen(true);
  // Função para fechar o modal
  const handleClose = () => setOpen(false);

  // Função para adicionar cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/clientes", {
        nome,
        telefone,
        email,
      });
      setClientes([...clientes, response.data]); // Atualizar a lista de clientes
      handleClose(); // Fechar o modal
      setNome("");
      setTelefone("");
      setEmail("");
    } catch (error) {
      setError("Erro ao adicionar cliente");
    }
  };

  // Função para remover cliente
  const removerCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/clientes/${id}`);
      setClientes(clientes.filter((cliente) => cliente.id !== id));
    } catch (error) {
      setError("Erro ao remover cliente");
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
    <div className="clientes-container">
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Clientes
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Adicionar Cliente
      </Button>

      {/* Modal para adicionar cliente */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Adicionar Cliente
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
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

      {/* Tabela de Clientes */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="editar cliente">
                    <EditIcon/>
                  </IconButton>
                  <IconButton
                    color="secondary"
                    aria-label="excluir cliente"
                    onClick={() => removerCliente(cliente.id)}
                  >
                    <DeleteIcon/>
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

export default Clientes;
