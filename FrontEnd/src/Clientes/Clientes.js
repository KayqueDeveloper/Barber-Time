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
import { validarCPF } from "../Helpers";

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

  const fetchClientes = async (page, searchTerm = "") => {
    try {
      const response = await axios.get("http://localhost:8080/clientes", {
        params: {
          page,
          limit: 5,
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

    // Validação de email
    if (!validarEmail(email)) {
      setError("Email inválido");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/clientes", {
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
      setClientes([...clientes, response.data]);
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
    console.log(" passou");

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
  };

  const handleOpenEdit = async (cliente) => {
    setCliente(cliente);
    setNome(cliente?.nome);
    setTelefone(cliente?.telefone);
    setEmail(cliente?.email);
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
  };
  const removerCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/clientes/${id}`);
      setClientes(clientes?.filter((cliente) => cliente?.id !== id));
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
              onChange={(e) => setNome(e?.target?.value)}
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
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              margin="normal"
              required
              error={error && error.includes("Email")}
              helperText={
                error && error.includes("Email") ? "Email inválido" : ""
              }
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
            <TextField
              fullWidth
              label="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={() => buscarEnderecoPorCEP(cep)} // Chama a função ao sair do campo
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Rua"
              value={rua}
              onChange={(e) => setRua(e?.target?.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Estado"
              value={estado}
              onChange={(e) => setEstado(e?.target?.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e?.target?.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Bairro"
              value={bairro}
              onChange={(e) => setBairro(e?.target?.value)}
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

      <Modal open={openEdit} onClose={handleClose} on>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Editar Cliente
          </Typography>
          <form onSubmit={handleSubmitEdit}>
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
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e?.target?.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
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
            <TextField
              fullWidth
              label="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={() => buscarEnderecoPorCEP(cep)} // Chama a função ao sair do campo
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Rua"
              value={rua}
              onChange={(e) => setRua(e?.target?.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Estado"
              value={estado}
              onChange={(e) => setEstado(e?.target?.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e?.target?.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Bairro"
              value={bairro}
              onChange={(e) => setBairro(e?.target?.value)}
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
              <TableCell>CPF</TableCell>
              <TableCell>CEP</TableCell>
              <TableCell>Rua</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Cidade</TableCell>
              <TableCell>Bairro</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes?.map((cliente) => (
              <TableRow key={cliente?.id}>
                <TableCell>{cliente?.nome}</TableCell>
                <TableCell>{cliente?.telefone}</TableCell>
                <TableCell>{cliente?.email}</TableCell>
                <TableCell>{cliente?.cpf}</TableCell>
                <TableCell>{cliente?.cep}</TableCell>
                <TableCell>{cliente?.rua}</TableCell>
                <TableCell>{cliente?.estado}</TableCell>
                <TableCell>{cliente?.cidade}</TableCell>
                <TableCell>{cliente?.bairro}</TableCell>
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
                    onClick={() => removerCliente(cliente?.id)}
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
