import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
  Grid,
  Alert,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import styled from "styled-components";
import "./Servicos.css";
import { FormatarSalario } from "../../Helpers/validacoes.ts";

// Tipos para serviços e resposta da API
interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracao: number;
}

interface ServicosResponse {
  servicos: Servico[];
  totalPages: number;
}

// Estilização com styled-components
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

const Servicos: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [servico, setServico] = useState<Servico | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [nome, setNome] = useState<string>("");
  const [preco, setPreco] = useState<string>("");
  const [duracao, setDuracao] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Função para buscar serviços
  const fetchServicos = async (page: number, searchTerm: string = "") => {
    try {
      const response = await axios.get<ServicosResponse>(
        "http://localhost:8080/servicos",
        {
          params: {
            page,
            search: searchTerm,
          },
        }
      );
      setServicos(response.data.servicos);
      setTotalPages(response.data.totalPages);
    } catch {
      setError("Erro ao buscar serviços");
    }
  };

  useEffect(() => {
    fetchServicos(page, searchTerm);
  }, [page, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
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

  const handleOpenEdit = (servico: Servico) => {
    setServico(servico);
    setNome(servico?.nome || "");
    setPreco(servico?.preco.toString() || "");
    setDuracao(servico?.duracao.toString() || "");
    setOpenEdit(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<Servico>(
        "http://localhost:8080/servicos",
        {
          nome,
          preco: parseFloat(preco),
          duracao: parseInt(duracao, 10),
        }
      );
      setServicos([...servicos, response.data]);
      handleClose();
    } catch {
      setError("Erro ao adicionar serviço");
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!servico) return;
    try {
      await axios.put(`http://localhost:8080/servicos/${servico.id}`, {
        nome,
        preco: parseFloat(preco),
        duracao: parseInt(duracao, 10),
      });
      fetchServicos(page, searchTerm);
    } catch {
      setError("Erro ao editar serviço");
    }
    handleClose();
  };

  const removerServico = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/servicos/${id}`);
      setServicos(servicos.filter((servico) => servico.id !== id));
    } catch {
      setError("Erro ao remover serviço");
    }
  };

  const handleSetPreco = (e) => {
    let number = Number.parseFloat(e?.target?.value?.replace(/\D/g, ""));
    if (isNaN(number)) {
      number = 0;
    }
    console.log(e?.target?.value);
    setPreco((number / 100).toString());
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    maxHeight: "60vh",
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
              value={FormatarSalario(parseFloat(preco))}
              onChange={handleSetPreco}
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
