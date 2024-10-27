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
import Pagination from "@mui/material/Pagination";
import "./Clientes.css";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState({});
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
  const [page, setPage] = useState(1); // Página atual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  const fetchClientes = async (page, searchTerm = "") => {
    try {
      const response = await axios.get("http://localhost:8080/clientes", {
        params: {
          page,
          limit: 5,
          search: searchTerm,
        },
      });
      setClientes(response?.data?.clientes);
      setTotalPages(response?.data?.totalPages);
      console.log(response.data.totalPages);
    } catch (error) {
      setError("Erro ao buscar clientes");
    }
  };

  useEffect(() => {
    fetchClientes(page, searchTerm);
  }, [page, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Atualiza o termo de pesquisa
    setPage(1); // Reseta a página para a primeira em caso de nova pesquisa
  };

  const handlePageChange = (event, value) => {
    setPage(value); // Atualiza a página atual
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/clientes", {
        nome,
        telefone,
        email,
      });
      setClientes([...clientes, response.data]);
      handleClose();
      setNome("");
      setTelefone("");
      setEmail("");
    } catch (error) {
      setError("Erro ao adicionar cliente");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8080/clientes/${cliente?.id}`,
        {
          nome,
          telefone,
          email,
        }
      );
      setCliente({});
      handleClose();
      setNome("");
      setTelefone("");
      setEmail("");
      fetchClientes(page, searchTerm);
    } catch (error) {
      setError("Erro ao editar cliente");
    }
  };

  const handleOpenEdit = async (cliente) => {
    setCliente(cliente);
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setEmail(cliente.email);
    setOpenEdit(true);
  };

  const removerCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/clientes/${id}`);
      setClientes(clientes?.filter((cliente) => cliente.id !== id));
    } catch (error) {
      setError("Erro ao remover cliente");
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
    <div className="clientes-container">
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Clientes
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
          placeholder="Digite o nome do cliente"
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Adicionar Cliente
        </Button>
      </Box>

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

      <Modal open={openEdit} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Editar Cliente
          </Typography>
          <form onSubmit={handleSubmitEdit}>
            <TextField
              fullWidth
              label="Nome"
              value={cliente?.nome}
              onChange={(e) => {
                setCliente({ ...cliente, nome: e.target.value });
                setNome(e.target.value);
              }}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Telefone"
              value={cliente?.telefone}
              onChange={(e) => {
                setCliente({ ...cliente, telefone: e.target.value });
                setTelefone(e.target.value);
              }}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={cliente?.email}
              onChange={(e) => {
                setCliente({ ...cliente, email: e.target.value });
                setEmail(e.target.value);
              }}
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
              <TableCell>Telefone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes?.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    aria-label="editar cliente"
                    onClick={() => handleOpenEdit(cliente)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    aria-label="excluir cliente"
                    onClick={() => removerCliente(cliente.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginação */}
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

export default Clientes;
