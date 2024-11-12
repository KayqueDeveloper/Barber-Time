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
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import "./Servicos.css";

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [servico, setServico] = useState({});
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [duracao, setDuracao] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchServicos = async (page, searchTerm = "") => {
    try {
      const response = await axios.get("http://localhost:8080/servicos", {
        params: {
          page,
          search: searchTerm,
        },
      });
      setServicos(response.data.servicos);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("Erro ao buscar serviços");
    }
  };

  useEffect(() => {
    fetchServicos(page, searchTerm);
  }, [page, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reseta para a primeira página ao realizar uma nova pesquisa
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenEdit = (servico) => {
    setServico(servico);
    setNome(servico?.nome);
    setPreco(servico?.preco);
    setDuracao(servico?.duracao);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setNome("");
    setPreco("");
    setDuracao("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/servicos", {
        nome,
        preco,
        duracao,
      });
      setServicos([...servicos, response?.data]);
      handleClose();
      setNome("");
      setPreco("");
      setDuracao("");
    } catch (error) {
      setError("Erro ao adicionar serviço");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/servicos/${servico?.id}`, {
        nome,
        preco,
        duracao,
      });
      fetchServicos(page, searchTerm);
    } catch (error) {
      setError("Erro ao editar serviço");
    }
    handleCloseEdit();
    setServico({});
  };

  const removerServico = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/servicos/${id}`);
      setServicos(servicos.filter((servico) => servico.id !== id));
    } catch (error) {
      setError("Erro ao remover serviço");
    }
  };

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

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <TextField
          label="Buscar por Nome"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Digite o nome do serviço"
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Adicionar Serviço
        </Button>
      </Box>

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
              onChange={(e) => setPreco(Number(e.target.value))}
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

      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Editar Serviço
          </Typography>
          <form onSubmit={handleSubmitEdit}>
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
              onChange={(e) => setPreco(Number(e.target.value))}
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
              Salvar
            </Button>
          </form>
        </Box>
      </Modal>

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
            {servicos?.map((servico) => (
              <TableRow key={servico.id}>
                <TableCell>{servico.nome}</TableCell>
                <TableCell>{servico.preco}</TableCell>
                <TableCell>{servico.duracao} min</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    aria-label="editar serviço"
                    onClick={() => {
                      handleOpenEdit(servico);
                    }}
                  >
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

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />
    </div>
  );
};

export default Servicos;
