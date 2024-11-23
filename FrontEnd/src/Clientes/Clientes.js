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
import { validarCPF, verificarCpf } from "../Helpers";
import styled from "styled-components";

const CardContainer = styled(Card)`
  border-radius: 12px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
`;

const BotaoAdd = styled(Button)`
  height: 56px;
  border-radius: 8px;
`;

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
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [cpfError, setCpfError] = useState(false);
  const [cpfExiste, setCpfExiste] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [ClienteParaExcluir, setClienteParaExcluir] = useState(null);

  const handleOpenDelete = (id) => {
    setClienteParaExcluir(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setClienteParaExcluir(null);
    setOpenDelete(false);
  };

  const fetchClientes = async (page, searchTerm = "") => {
    try {
      const response = await axios.get("http://localhost:8080/clientes", {
        params: {
          page,
          limit: 6,
          search: searchTerm,
        },
      });
      const { clientes, currentPage, totalPages } = response.data;
      setClientes(clientes); // Atualiza a lista de clientes
      setPage(currentPage); // Atualiza a página atual
      setTotalPages(totalPages); // Atualiza o total de páginas
    } catch (error) {
      setError("Erro ao buscar clientes");
    }
  };

  const buscarEnderecoPorCEP = async (cep) => {
    setCep(cep); // Garante que o CEP não seja modificado

    if (cep.length === 8) {
      // Verifica se o CEP tem 8 dígitos
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        if (response.data.erro) {
          setError("CEP não encontrado");
        } else {
          setRua(response.data.logradouro);
          setBairro(response.data.bairro);
          setCidade(response.data.localidade);
          setEstado(response.data.uf);
          setCep(cep); // Garante que o CEP não seja modificado
        }
      } catch (error) {
        setError("Erro ao buscar endereço");
      }
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
    resetForm();
    setOpen(false);
    setOpenEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação de CPF
    if (!validarCPF(cpf)) {
      setCpfError(true);
      return;
    }

    const cpfDisponivel = await verificarCpf(
      cliente?.id,
      cpf,
      "cliente",
      setCpfExiste
    );
    if (!cpfDisponivel) {
      return; // CPF já existe ou ocorreu um erro
    }

    // Validação de email
    if (!validarEmail(email)) {
      setError("Email inválido");
      return;
    }

    try {
      await axios.post("http://localhost:8080/clientes", {
        nome,
        telefone,
        email,
        cpf,
        cep,
        rua,
        estado,
        cidade,
        bairro,
      });
      handleClose();
      resetForm();
    } catch (error) {
      setError("Erro ao adicionar cliente");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    // Validação de CPF
    if (!validarCPF(cpf)) {
      setCpfError(true);
      return;
    }

    const cpfDisponivel = await verificarCpf(
      cliente?.id,
      cpf,
      "cliente",
      setCpfExiste
    );
    if (!cpfDisponivel) {
      return; // CPF já existe ou ocorreu um erro
    }

    try {
      await axios.put(`http://localhost:8080/clientes/${cliente?.id}`, {
        nome,
        telefone,
        email,
        cpf,
        cep,
        rua,
        estado,
        cidade,
        bairro,
      });
      setCliente({});
      handleClose();
      resetForm();
      fetchClientes(page, searchTerm);
    } catch (error) {
      console.log(error);
      setError("Erro ao editar cliente");
    }
  };

  const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Função para limpar o formulário
  const resetForm = () => {
    setNome("");
    setTelefone("");
    setEmail("");
    setCpf("");
    setCep("");
    setRua("");
    setEstado("");
    setCidade("");
    setBairro("");
    setCpfError(false); // Reseta o erro de CPF
    setCpfExiste(undefined);
  };

  const handleOpenEdit = async (cliente) => {
    setCliente(cliente);
    setNome(cliente?.nome);
    setTelefone(cliente?.telefone);
    setEmail(cliente?.email);
    setCpf(cliente?.cpf);
    setCep(cliente?.cep);
    setRua(cliente?.rua);
    setEstado(cliente?.estado);
    setCidade(cliente?.cidade);
    setBairro(cliente?.bairro);
    setOpenEdit(true);
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

  const removerCliente = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/clientes/${ClienteParaExcluir}`
      );
      setClientes(
        clientes?.filter((cliente) => cliente?.id !== ClienteParaExcluir)
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
              label="Telefone"
              variant="outlined"
              fullWidth
              margin="normal"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="CPF"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cpf}
              onChange={handleSetCPF}
              required
              error={cpfError || cpfExiste}
              helperText={cpfExiste ? cpfExiste : cpfError && "CPF inválido"}
              inputProps={{ maxLength: 14 }}
            />
            <TextField
              label="CEP"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cep}
              onChange={(e) => buscarEnderecoPorCEP(e.target.value)}
              required
            />
            <TextField
              label="Rua"
              variant="outlined"
              fullWidth
              margin="normal"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />
            <TextField
              label="Bairro"
              variant="outlined"
              fullWidth
              margin="normal"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
            <TextField
              label="Cidade"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />
            <TextField
              label="Estado"
              variant="outlined"
              fullWidth
              margin="normal"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
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
