import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { Card, CardContent, CardActions, Grid } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import "./Funcionarios.css";
import styled from "styled-components";
import { validarCPF, FormatarSalario, verificarCpf } from "../Helpers";


const CardContainer = styled(Card)`
  border-radius: 12px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
`;

const BotaoAdd = styled(Button)`
  height: 56px;
  border-radius: 8px;
`;


const CARGOS = {
  BARBEIRO: "Barbeiro",
  SECRETARIA: "Secretaria",
  CEO: "CEO",
};
const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionario, setFuncionario] = useState({});
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cpf, setCpf] = useState("");
  const [cpfExiste, setCpfExiste] = useState("");
  const [salario, setSalario] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpfError, setCpfError] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [FuncionarioParaExcluir, setFuncionarioParaExcluir] = useState(null);

  const fetchFuncionarios = async (page, searchTerm = "") => {
    try {
      const response = await axios.get("http://localhost:8080/funcionarios", {
        params: {
          page,
          limit: 6,
          search: searchTerm,
        },
      });
      const { funcionarios, currentPage, totalPages } = response.data;
      console.log(funcionarios)
      setFuncionarios(funcionarios);
      setPage(currentPage);
      setTotalPages(totalPages);
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
    resetForm();
    setOpen(false);
    setOpenEdit(false);
    setOpenDelete(false);
  };

  const resetForm = () => {
    setNome("");
    setCargo("");
    setEspecialidade("")
    setTelefone("");
    setSalario("");
    setCpf("");
    setFuncionario({});
    setCpfError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cpf) {
      setCpfError(true);
      return;
    }

    const cpfDisponivel = await verificarCpf(funcionario?.id, cpf, "funcionario", setCpfExiste);
    if (!cpfDisponivel) {
      return;
    }

    try {
      await axios.post("http://localhost:8080/funcionarios", {
        nome,
        cargo,
        cpf,
        especialidade,
        salario,
        telefone,
      });
      handleClose();
      resetForm();
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

    const cpfDisponivel = await verificarCpf(funcionario?.id, cpf, "funcionario", setCpfExiste);
    if (!cpfDisponivel) {
      return; // CPF já existe ou ocorreu um erro
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
      resetForm();
      setOpenEdit(false);
      fetchFuncionarios(page, searchTerm);
    } catch (error) {
      setError("Erro ao editar funcionário.");
    }
  };

  const handleOpenEdit = async (funcionario) => {
    setFuncionario(funcionario);
    setNome(funcionario?.nome);
    setCargo(funcionario?.cargo);
    setCpf(funcionario?.cpf);
    setEspecialidade(funcionario.especialidade)
    setSalario(funcionario.salario)
    setTelefone(funcionario.telefone)
    setOpenEdit(true);
  };

  const removerFuncionario = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/funcionarios/${FuncionarioParaExcluir}`
      );
      setFuncionarios(
        funcionarios?.filter(
          (funcionario) => funcionario?.id !== FuncionarioParaExcluir
        )
      );
    } catch (error) {
      setError("Erro ao remover funcionário");
    }
    fetchFuncionarios(page, searchTerm);
    setOpenDelete(false);
  };

  const handleSetSalario = (e) => {
    let number = Number.parseFloat(e?.target?.value);
    if (isNaN(number)) {
      number = 0;
    }
    setSalario(number);
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
    setCpfExiste(undefined);
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
      <Typography variant="h4" gutterBottom color="white">
        Gerenciamento de Funcionários
      </Typography>
      {error && (
        <Alert severity="error" className="error-message">
          {error}
        </Alert>
      )}

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
          variant="filled"
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
        <BotaoAdd variant="contained" color="primary" onClick={handleOpen}>
          Adicionar Funcionário
        </BotaoAdd>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Grid container spacing={2}>
          {funcionarios?.map((funcionario) => (
            <Grid item xs={12} sm={6} md={4} key={funcionario.id}>
              <CardContainer>
                <CardContent>
                  <Typography variant="h6">{funcionario.nome}</Typography>
                  <Typography variant="body2">
                    Cargo: {funcionario.cargo}
                  </Typography>
                  <Typography variant="body2">
                    Salario: {funcionario.salario}
                  </Typography>
                  <Typography variant="body2">
                    CPF: {funcionario.cpf}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => handleOpenEdit(funcionario)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpenDelete(true);
                      setFuncionarioParaExcluir(funcionario.id);
                    }}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </CardContainer>
            </Grid>
          ))}
        </Grid>

        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="secondary"
          sx={{ marginTop: "20px" }}
        />
      </Box>

      <Modal open={open || openEdit} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            {openEdit ? "Editar Funcionário" : "Adicionar Funcionário"}
          </Typography>
          {error && (
            <Alert severity="error" className="error-message">
              {error}
            </Alert>
          )}
          <Typography variant="body1" gutterBottom color="info">
            Os campos obrigatórios estão marcados com '*'     
          </Typography>
          <form onSubmit={openEdit ? handleSubmitEdit : handleSubmit}>
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              margin="normal"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="CPF"
              value={cpf}
              onChange={handleSetCPF}
              margin="normal"
              required
              error={cpfError || cpfExiste}
              helperText={cpfExiste ? cpfExiste : cpfError && "CPF inválido"}
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
              label="Salário"
              value={salario}
              onChange={handleSetSalario}
              margin="normal"
              required
            />
            <Box display="flex" justifyContent="flex-end">
              <Button
                onClick={handleClose}
                color="secondary"
                sx={{ marginRight: 2 }}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {openEdit ? "Salvar" : "Adicionar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <Modal open={openDelete} onClose={handleClose}>
        <Box sx={{ ...modalStyle, height: "120px" }}>
          <Typography variant="h6" component="h2">
            Tem certeza de que deseja excluir o funcionario {funcionario?.nome}{" "}
            ?
          </Typography>
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button
              onClick={handleClose}
              color="secondary"
              sx={{ marginRight: 2 }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={removerFuncionario}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Funcionarios;
