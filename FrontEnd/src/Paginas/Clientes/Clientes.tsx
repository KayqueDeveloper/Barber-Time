import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import { Card, CardContent, CardActions, Grid } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import "./Clientes.css";
import { validarCPF, verificarCpf } from "../../Helpers/validacoes.ts";
import styled from "styled-components";
import { Cliente } from "../../Models/Tipos";

const CardContainer = styled(Card)`
  border-radius: 12px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
`;

const BotaoAdd = styled(Button)`
  height: 56px;
  border-radius: 8px;
`;

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cliente, setCliente] = useState<Cliente>({
    id: 0, // Valor inicial para id
    nome: "",
    telefone: "",
    email: "",
    criado_em: "",
    cpf: "",
    rua: "",
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
  });
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Termo de pesquisa
  const [page, setPage] = useState<number>(1); // Página atual
  const [totalPages, setTotalPages] = useState<number>(1); // Total de páginas
  const [cpfError, setCpfError] = useState(false);
  const [cpfExiste, setCpfExiste] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [ClienteParaExcluir, setClienteParaExcluir] = useState<number | null>(
    null
  );

  const handleOpenDelete = (id: number) => {
    setClienteParaExcluir(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setClienteParaExcluir(null);
    setOpenDelete(false);
  };

  const fetchClientes = async (page: number, searchTerm: string = "") => {
    try {
      const response = await axios.get("http://localhost:8080/clientes", {
        params: {
          page,
          limit: 6,
          search: searchTerm,
        },
      });
      const { clientes, currentPage, totalPages } = response.data;
      setClientes(clientes);
      setPage(currentPage);
      setTotalPages(totalPages);
    } catch (error) {
      setError("Erro ao buscar clientes");
    }
  };

  const buscarEnderecoPorCEP = async (cep: string) => {
    setCliente({ ...cliente, cep });

    if (cep.length > 7) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        if (response.data.erro) {
          setError("CEP não encontrado");
        } else {
          setCliente({
            ...cliente,
            rua: response.data.logradouro,
            bairro: response.data.bairro,
            cidade: response.data.localidade,
            estado: response.data.uf,
            cep,
          });

          console.log(response.data.uf);
        }
      } catch (error) {
        setError("Erro ao buscar endereço");
      }
    }
  };

  useEffect(() => {
    fetchClientes(page, searchTerm);
  }, [page, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetForm();
    setOpen(false);
    setOpenEdit(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCPF(cliente?.cpf)) {
      setCpfError(true);
      return;
    }

    const cpfDisponivel = await verificarCpf(
      cliente?.id,
      cliente?.cpf,
      "cliente",
      setCpfExiste
    );
    if (!cpfDisponivel) {
      return;
    }

    if (!validarEmail(cliente?.email)) {
      setError("Email inválido");
      return;
    }

    if (!openEdit) {
      try {
        await axios.post("http://localhost:8080/clientes", cliente);
        handleClose();
        resetForm();
      } catch (error) {
        setError("Erro ao adicionar cliente");
      }
      return;
    }
    try {
      await axios.put(`http://localhost:8080/clientes/${cliente?.id}`, cliente);
      handleClose();
      resetForm();
      fetchClientes(page, searchTerm);
    } catch (error) {
      setError("Erro ao editar cliente");
    }
  };

  const validarEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const resetForm = () => {
    setCliente({
      id: 0, // Valor inicial para id
      nome: "",
      telefone: "",
      email: "",
      criado_em: "",
      cpf: "",
    });
    setCpfError(false);
    setCpfExiste("");
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setCliente(cliente);
    setOpenEdit(true);
  };

  const handleSetCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "");

    const formattedCpf = onlyNumbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setCliente({ ...cliente, cpf: formattedCpf });

    if (!validarCPF(e.target.value)) {
      setCpfError(true);
      return;
    }
    setCpfError(false);
    setCpfExiste("");
  };

  const removerCliente = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/clientes/${ClienteParaExcluir}`
      );
      setClientes(
        clientes?.filter((cliente) => cliente.id !== ClienteParaExcluir)
      );
    } catch (error) {
      setError("Erro ao remover cliente");
    }
    fetchClientes(page, searchTerm);
    handleCloseDelete();
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: "80vh",
    overflow: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "4px",
  };

  return (
    <div className="clientes-container">
      <Typography variant="h4" gutterBottom color="white">
        Gerenciamento de Clientes
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
          placeholder="Digite o nome do cliente"
          variant="filled"
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
        <BotaoAdd variant="contained" color="primary" onClick={handleOpen}>
          Adicionar Cliente
        </BotaoAdd>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Grid container spacing={2}>
          {clientes?.map((cliente) => (
            <Grid item xs={12} sm={6} md={4} key={cliente.id}>
              <CardContainer style={{ borderRadius: "4px" }}>
                <CardContent>
                  <Typography variant="h6">{cliente.nome}</Typography>
                  <Typography variant="body2">
                    Telefone: {cliente.telefone}
                  </Typography>
                  <Typography variant="body2">
                    Email: {cliente.email}
                  </Typography>
                  <Typography variant="body2">CPF: {cliente.cpf}</Typography>
                  <Typography variant="body2">CEP: {cliente.cep}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => handleOpenEdit(cliente)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDelete(cliente.id)}
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
            {openEdit ? "Editar Cliente" : "Adicionar Cliente"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cliente?.nome}
              onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
              required
            />
            <TextField
              label="Telefone"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cliente?.telefone}
              onChange={(e) =>
                setCliente({ ...cliente, telefone: e.target.value })
              }
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cliente?.email}
              onChange={(e) =>
                setCliente({ ...cliente, email: e.target.value })
              }
              required
            />
            <TextField
              label="CPF"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cliente?.cpf}
              onChange={handleSetCPF}
              required
              error={cpfError || cpfExiste !== ""}
              helperText={cpfExiste ? cpfExiste : cpfError && "CPF inválido"}
              inputProps={{ maxLength: 14 }}
            />
            <TextField
              label="CEP"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cliente?.cep}
              onChange={(e) => buscarEnderecoPorCEP(e.target.value)}
              required
            />
            <TextField
              label="Rua"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cliente?.rua}
              onChange={(e) => setCliente({ ...cliente, rua: e.target.value })}
            />
            <TextField
              label="Bairro"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cliente?.bairro}
              onChange={(e) =>
                setCliente({ ...cliente, bairro: e.target.value })
              }
            />
            <TextField
              label="Cidade"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cliente?.cidade}
              onChange={(e) =>
                setCliente({ ...cliente, cidade: e.target.value })
              }
            />
            <TextField
              label="Estado"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cliente?.estado}
              onChange={(e) =>
                setCliente({ ...cliente, estado: e.target.value })
              }
            />

            <Box display="flex" justifyContent="flex-end">
              <Button
                onClick={handleClose}
                color="secondary"
                sx={{ marginRight: 2 }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={cpfError}
              >
                {openEdit ? "Salvar" : "Adicionar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Modal open={openDelete} onClose={handleCloseDelete}>
        <Box sx={{ ...modalStyle, height: "120px" }}>
          <Typography variant="h6" component="h2">
            Tem certeza de que deseja excluir este cliente?
          </Typography>
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button
              onClick={handleCloseDelete}
              color="secondary"
              sx={{ marginRight: 2 }}
            >
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={removerCliente}>
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Clientes;
