import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
  Grid,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import "./Servicos.css";

import styled from "styled-components";

const CardContainer = styled.div`
  border-radius: 12px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  padding: 16px;
`;

const BotaoAdd = styled(Button)`
  height: 56px;
  border-radius: 8px;
`;

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [servico, setServico] = useState({});
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [duracao, setDuracao] = useState();
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
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNome("");
    setPreco("");
    setDuracao("");
    setOpen(false);
    setOpenEdit(false);
  };

  const handleOpenEdit = (servico) => {
    setServico(servico);
    setNome(servico?.nome);
    setPreco(servico?.preco);
    setDuracao(servico?.duracao);
    setOpenEdit(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/servicos", {
        nome,
        preco: parseFloat(preco), // Convertendo preço para float
        duracao: parseInt(duracao, 10),
      });
      setServicos([...servicos, response?.data]);
      handleClose();
    } catch (error) {
      setError("Erro ao adicionar serviço");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/servicos/${servico?.id}`, {
        nome,
        preco: parseFloat(preco), // Convertendo preço para float
        duracao: parseInt(duracao, 10),
      });
      fetchServicos(page, searchTerm);
    } catch (error) {
      setError("Erro ao editar serviço");
    }
    handleClose();
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
    maxheight: "60vh",
    overflow: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="servicos-container">
      <Typography variant="h4" gutterBottom color="white">
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
          variant="filled"
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
        <BotaoAdd variant="contained" color="primary" onClick={handleOpen}>
          Adicionar Serviço
        </BotaoAdd>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Grid container spacing={2}>
          {servicos.map((servico) => (
            <Grid item xs={12} sm={6} md={4} key={servico.id}>
              <CardContainer>
                <Typography variant="h6">{servico.nome}</Typography>
                <Typography variant="body2">
                  Preço: R$ {servico.preco}
                </Typography>
                <Typography variant="body2">
                  Duração: {servico.duracao} min
                </Typography>
                <Box display="flex" justifyContent="flex-end">
                  <IconButton
                    onClick={() => handleOpenEdit(servico)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => removerServico(servico.id)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
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
            {openEdit ? "Editar Serviço" : "Adicionar Serviço"}
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
              label="Preço"
              variant="outlined"
              fullWidth
              margin="normal"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
            <TextField
              label="Duração (min)"
              variant="outlined"
              fullWidth
              margin="normal"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
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
    </div>
  );
};

export default Servicos;
