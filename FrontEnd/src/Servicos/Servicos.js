// Servicos.js
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
import "./Servicos.css";

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [open, setOpen] = useState(false); // Estado para controlar o modal
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [duracao, setDuracao] = useState("");
  const [error, setError] = useState("");

  // Buscar serviços do backend quando o componente é montado
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

  // Função para abrir o modal
  const handleOpen = () => setOpen(true);
  // Função para fechar o modal
  const handleClose = () => setOpen(false);

  // Função para adicionar serviço
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/servicos", {
        nome,
        preco,
        duracao,
      });
      setServicos([...servicos, response.data]); // Atualizar a lista de serviços
      handleClose(); // Fechar o modal
      setNome("");
      setPreco("");
      setDuracao("");
    } catch (error) {
      setError("Erro ao adicionar serviço");
    }
  };

  // Função para remover serviço
  const removerServico = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/servicos/${id}`);
      setServicos(servicos.filter((servico) => servico.id !== id));
    } catch (error) {
      setError("Erro ao remover serviço");
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
    <div className="servicos-container">
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Serviços
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Adicionar Serviço
      </Button>

      {/* Modal para adicionar serviço */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Adicionar Serviço
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
              label="Preço"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Duração (min)"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
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

      {/* Tabela de Serviços */}
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Duração</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servicos.map((servico) => (
              <TableRow key={servico.id}>
                <TableCell>{servico.nome}</TableCell>
                <TableCell>{servico.preco}</TableCell>
                <TableCell>{servico.duracao} min</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="editar serviço">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    aria-label="excluir serviço"
                    onClick={() => removerServico(servico.id)}
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

export default Servicos;
