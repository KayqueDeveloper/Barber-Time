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
import {
  validarCPF,
  FormatarSalario,
  verificarCpf,
} from "../../Helpers/validacoes.ts";
import { Funcionario } from "../../Models/Tipos";

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

const funcionarioLimpo = {
  id: 0, // Valor inicial para id
  nome: "",
  especialidade: " ",
  telefone: "",
  criado_em: "",
  cpf: "",
};

const Funcionarios: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [funcionario, setFuncionario] = useState<Funcionario>(funcionarioLimpo);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [cpfExiste, setCpfExiste] = useState<string>("");
  const [cpfError, setCpfError] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] =
    useState<number>();

  const fetchFuncionarios = async (page: number, searchTerm: string = "") => {
    try {
      const response = await axios.get("http://localhost:8080/funcionarios", {
        params: {
          page,
          limit: 6,
          search: searchTerm,
        },
      });
      const { funcionarios, currentPage, totalPages } = response.data;
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (_, value: number) => {
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
    setFuncionario(funcionarioLimpo);
    setCpfError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!funcionario?.cpf) {
      setCpfError(true);
      return;
    }

    const cpfDisponivel = await verificarCpf(
      funcionario?.id,
      funcionario?.cpf,
      "funcionario",
      setCpfExiste
    );
    if (!cpfDisponivel) {
      return;
    }

    if (openEdit) {
      try {
        await axios.put(
          `http://localhost:8080/funcionarios/${funcionario?.id}`,
          funcionario
        );
        resetForm();
        setOpenEdit(false);
        fetchFuncionarios(page, searchTerm);
      } catch (error) {
        setError("Erro ao editar funcionário.");
      }
      return;
    }

    try {
      await axios.post("http://localhost:8080/funcionarios", funcionario);
      handleClose();
      resetForm();
    } catch (error) {
      setError("Erro ao adicionar funcionário");
    }
  };

  const handleOpenEdit = async (funcionario: Funcionario) => {
    setFuncionario(funcionario);
    setOpenEdit(true);
  };

  const removerFuncionario = async () => {
    try {
      if (funcionarioParaExcluir) {
        await axios.delete(
          `http://localhost:8080/funcionarios/${funcionarioParaExcluir}`
        );
        setFuncionarios(
          funcionarios.filter(
            (funcionario) => funcionario.id !== funcionarioParaExcluir
          )
        );
        fetchFuncionarios(page, searchTerm);
        setOpenDelete(false);
      }
    } catch (error) {
      setError("Erro ao remover funcionário");
    }
  };

  const handleSetSalario = (e) => {
    let number = Number.parseFloat(e?.target?.value?.replace(/\D/g, ""));
    if (isNaN(number)) {
      number = 0;
    }
    console.log(number);
    setFuncionario({ ...funcionario, salario: number / 100 });
  };

  const handleSetCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");

    const cpf = onlyNumbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setFuncionario({ ...funcionario, cpf });

    if (!validarCPF(e.target.value)) {
      setCpfError(true);
      return;
    }
    setCpfError(false);
    setCpfExiste("");
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
                    Salario: {FormatarSalario(funcionario.salario)}
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
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              margin="normal"
              value={funcionario?.nome}
              onChange={(e) =>
                setFuncionario({ ...funcionario, nome: e.target.value })
              }
              required
            />
            <TextField
              fullWidth
              label="CPF"
              value={funcionario?.cpf}
              onChange={handleSetCPF}
              margin="normal"
              required
              error={cpfError || cpfExiste !== ""}
              helperText={cpfExiste ? cpfExiste : cpfError && "CPF inválido"}
              inputProps={{ maxLength: 14 }}
            />
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={funcionario?.cargo}
              label="Cargo"
              margin="dense"
              onChange={(e) =>
                setFuncionario({ ...funcionario, cargo: e.target.value })
              }
            >
              {Object.entries(CARGOS)?.map(([_, value]) => (
                <MenuItem value={value}>{value}</MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              label="Especialidade"
              value={funcionario?.especialidade}
              onChange={(e) =>
                setFuncionario({
                  ...funcionario,
                  especialidade: e.target.value,
                })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Telefone"
              value={funcionario?.telefone}
              onChange={(e) =>
                setFuncionario({ ...funcionario, telefone: e.target.value })
              }
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Salário"
              value={FormatarSalario(funcionario?.salario)}
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
