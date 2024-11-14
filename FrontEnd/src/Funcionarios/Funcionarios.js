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
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { validarCPF, FormatarSalario } from "../Helpers";

import "./Funcionarios.css";

const CARGOS = {
  ["BARBEIRO"]: "Barbeiro",
  ["SECRETARIA"]: "Secretaria",
  ["CEO"]: "CEO",
};

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionario, setFuncionario] = useState({});
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [nome, setNome] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [cargo, setCargo] = useState("");
  const [salario, setSalario] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cpfError, setCpfError] = useState(false);

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
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNome("");
    setEspecialidade("");
    setTelefone("");
    setCpf("");
    setCargo("");
    setSalario("");
    setOpen(false);
  };

  const handleOpenEdit = (funcionario) => {
    setFuncionario(funcionario);
    setNome(funcionario?.nome);
    setEspecialidade(funcionario?.especialidade);
    setTelefone(funcionario?.telefone);
    setCpf(funcionario?.cpf);
    setCargo(funcionario?.cargo);
    setSalario(funcionario?.salario);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setNome("");
    setEspecialidade("");
    setTelefone("");
    setCpf("");
    setCargo("");
    setSalario("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarCPF(cpf)) {
      setCpfError(true);
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/funcionarios", {
        nome,
        especialidade,
        telefone,
        cpf,
        cargo,
        salario,
      });
      setFuncionarios([...funcionarios, response.data]);
      handleClose();
    } catch (error) {
      setError("Erro ao adicionar funcionário");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validarCPF(cpf)) {
      setCpfError(true);
      return;
    }
    try {
      await axios.put(`http://localhost:8080/funcionarios/${funcionario?.id}`, {
        nome,
        especialidade,
        telefone,
        cpf,
        cargo,
        salario,
      });
      handleCloseEdit();
      fetchFuncionarios(page, searchTerm);
    } catch (error) {
      setError("Erro ao editar funcionário");
    }
  };

  const handleSetCPF = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");

    const formattedCpf = onlyNumbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    if (!validarCPF(e.target.value)) {
      setCpfError(true);
      setCpf(formattedCpf);
      return;
    }
    setCpf(formattedCpf);
    setCpfError(false);
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

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <TextField
          label="Buscar por Nome"
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Adicionar Funcionário
        </Button>
      </Box>

      {/* Modal Adicionar */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Adicionar Funcionário</Typography>
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
            <TextField
              fullWidth
              label="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              margin="normal"
              required
              inputProps={{ maxLength: 14 }}
            />
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={cargo}
              label="Cargo"
              margin="normal"
              onChange={(e) => setCargo(e.target.value)}
            >
              {Object.entries(CARGOS)?.map(([_, value]) => (
                <MenuItem value={value}>{value}</MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              label="Salário"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
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

      {/* Modal Editar */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Editar Funcionário</Typography>
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
            <TextField
              fullWidth
              label="CPF"
              value={cpf}
              onChange={handleSetCPF}
              margin="normal"
              required
              error={cpfError}
              helperText={cpfError && "CPF inválido"}
              inputProps={{ maxLength: 14 }}
            />
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={cargo}
              label="Cargo"
              margin="normal"
              onChange={(e) => setCargo(e.target.value)}
            >
              {Object.entries(CARGOS)?.map(([_, value]) => (
                <MenuItem value={value}>{value}</MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              label="Salário"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
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

      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Especialidade</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Salário</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {funcionarios?.map((funcionario) => (
              <TableRow key={funcionario?.id}>
                <TableCell>{funcionario?.nome}</TableCell>
                <TableCell>{funcionario?.especialidade}</TableCell>
                <TableCell>{funcionario?.telefone}</TableCell>
                <TableCell>{funcionario?.cpf}</TableCell>
                <TableCell>{funcionario?.cargo}</TableCell>
                <TableCell>{FormatarSalario(funcionario?.salario)}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenEdit(funcionario)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
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
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </div>
  );
};

export default Funcionarios;
