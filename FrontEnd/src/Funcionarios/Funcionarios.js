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
import "./Funcionarios.css";

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionario, setFuncionario] = useState({});
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [nome, setNome] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
  const [page, setPage] = useState(1); // Página atual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas

  const fetchFuncionarios = async (page, searchTerm = "") => {
    try {
      const response = await axios.get("http://localhost:8080/funcionarios", {
        params: {
          page,
          search: searchTerm,
        },
      });
      setFuncionarios(response.data.funcionarios);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("Erro ao buscar funcionários");
    }
  };

  useEffect(() => {
    fetchFuncionarios(page, searchTerm);
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

  const handleOpenEdit = (funcionario) => {
    setFuncionario(funcionario);
    setNome(funcionario?.nome);
    setTelefone(funcionario?.telefone);
    setEspecialidade(funcionario?.especialidade);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setNome("");
    setEspecialidade("");
    setTelefone("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/funcionarios", {
        nome,
        especialidade,
        telefone,
      });
      setFuncionarios([...funcionarios, response?.data]);
      handleClose();
      setNome("");
      setEspecialidade("");
      setTelefone("");
    } catch (error) {
      setError("Erro ao adicionar funcionário");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios?.put(
        `http://localhost:8080/funcionarios/${funcionario?.id}`,
        {
          nome,
          telefone,
          especialidade,
        }
      );
      handleCloseEdit();
      setFuncionario({});
      setNome("");
      setTelefone("");
      fetchFuncionarios(page, searchTerm);
    } catch (error) {
      setError("Erro ao editar funcionario");
    }
  };

  const removerFuncionario = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/funcionarios/${id}`);
      setFuncionarios(
        funcionarios.filter((funcionario) => funcionario?.id !== id)
      );
    } catch (error) {
      setError("Erro ao remover funcionário");
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
    <div className="funcionarios-container">
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Funcionários
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
          placeholder="Digite o nome do funcionário"
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Adicionar Funcionário
        </Button>
      </Box>

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
              onChange={(e) => setNome(e?.target?.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Especialidade"
              value={especialidade}
              onChange={(e) => setEspecialidade(e?.target?.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e?.target?.value)}
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
            Editar Funcionario
          </Typography>
          <form onSubmit={handleSubmitEdit}>
            <TextField
              fullWidth
              label="Nome"
              value={funcionario?.nome}
              onChange={(e) => {
                setFuncionario({ ...funcionario, nome: e?.target?.value });
                setNome(e.target.value);
              }}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Telefone"
              value={funcionario?.telefone}
              onChange={(e) => {
                setFuncionario({ ...funcionario, telefone: e?.target?.value });
                setTelefone(e.target.value);
              }}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Especialidade"
              value={funcionario?.especialidade}
              onChange={(e) => {
                setFuncionario({
                  ...funcionario,
                  especialidade: e?.target?.value,
                });
                setEspecialidade(e.target.value);
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
              <TableCell>Especialidade</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funcionarios?.map((funcionario) => (
              <TableRow key={funcionario?.id}>
                <TableCell>{funcionario?.nome}</TableCell>
                <TableCell>{funcionario?.especialidade}</TableCell>
                <TableCell>{funcionario?.telefone}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    aria-label="editar funcionário"
                    onClick={() => handleOpenEdit(funcionario)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    aria-label="excluir funcionário"
                    onClick={() => removerFuncionario(funcionario?.id)}
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

export default Funcionarios;
