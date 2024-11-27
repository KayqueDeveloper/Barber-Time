import React from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { Card, CardContent, CardActions, Grid } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Pagination from "@mui/material/Pagination";
import "./Clientes.css";
import styled from "styled-components";
import { useClientes } from "./Clientes.data.ts";

import * as S from "./Clientes.style.ts";

const CardContainer = styled(Card)`
  border-radius: 12px;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.3);
`;

const BotaoAdd = styled(Button)`
  height: 56px;
  border-radius: 8px;
`;

const Clientes: React.FC = () => {
  const {
    erro,
    searchTermo,
    abriModal,
    clientes,
    abrirEditar,
    deletar,
    totalPaginas,
    pagina,
    mudarDePagina,
    abrir,
    abrirEdicao,
    fecharModal,
    enviarDados,
    cliente,
    setCliente,
    definirCPF,
    cpfErro,
    cpfExiste,
    buscarEnderecoPorCEP,
    abrirDelecao,
    fecharDeletar,
    removerCliente,
    pesquisar,
    snackbarSeverity,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
  } = useClientes();

  return (
    <div className="clientes-container">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} // Tempo em milissegundos para desaparecer
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Typography variant="h4" gutterBottom color="white">
        Gerenciamento de Clientes
      </Typography>
      {erro && (
        <Alert severity="error" className="error-message">
          {erro}
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
          value={searchTermo}
          onChange={pesquisar}
          placeholder="Digite o nome do cliente"
          variant="filled"
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
        <BotaoAdd variant="contained" color="primary" onClick={abriModal}>
          Adicionar Cliente
        </BotaoAdd>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Grid container spacing={2}>
          {clientes?.map((cliente) => (
            <Grid item xs={12} sm={6} md={4} key={cliente.id}>
              <CardContainer
                style={{
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "16px",
                  background: "rgba(255, 255, 255, 0.2)", // Fundo translúcido
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)", // Sombra
                  backdropFilter: "blur(10px)", // Desfoque no fundo
                  border: "1px solid rgba(255, 255, 255, 0.3)", // Borda semi-transparente
                  transition: "transform 0.3s ease, box-shadow 0.3s ease", // Transições suaves
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)"; // Aumenta ligeiramente o tamanho
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(0, 0, 0, 0.3)"; // Aumenta a sombra
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)"; // Volta ao tamanho original
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0, 0, 0, 0.2)"; // Volta à sombra original
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold", color: "white" }}
                  >
                    {cliente.nome}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <span style={{ fontWeight: "bold", color: "white" }}>
                      Telefone:
                    </span>{" "}
                    {cliente.telefone}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <span style={{ fontWeight: "bold", color: "white" }}>
                      Email:
                    </span>{" "}
                    {cliente.email}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <span style={{ fontWeight: "bold", color: "white" }}>
                      CPF:
                    </span>{" "}
                    {cliente.cpf}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <span style={{ fontWeight: "bold", color: "white" }}>
                      CEP:
                    </span>{" "}
                    {cliente.cep}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => abrirEditar(cliente)}
                    color="secondary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => deletar(cliente.id)}
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
          count={totalPaginas}
          page={pagina}
          onChange={mudarDePagina}
          color="secondary"
          sx={{ marginTop: "20px" }}
        />
      </Box>

      <Modal open={abrir || abrirEdicao} onClose={fecharModal}>
        <S.ModalBox>
          <Typography variant="h6" component="h2">
            {abrirEdicao ? "Editar Cliente" : "Adicionar Cliente"}
          </Typography>
          <form onSubmit={enviarDados}>
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
              onChange={definirCPF}
              required
              error={cpfErro || cpfExiste !== ""}
              helperText={cpfExiste ? cpfExiste : cpfErro && "CPF inválido"}
              inputProps={{ maxLength: 14 }}
            />
            <TextField
              label="CEP"
              variant="outlined"
              fullWidth
              margin="normal"
              value={cliente?.cep
                ?.replace(/\D/g, "")
                ?.replace(/(\d{5})(\d)/, "$1-$2")}
              onChange={(e) => buscarEnderecoPorCEP(e.target.value)}
              inputProps={{ maxLength: 9 }}
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
                onClick={fecharModal}
                color="secondary"
                sx={{ marginRight: 2 }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={cpfErro}
              >
                {abrirEdicao ? "Salvar" : "Adicionar"}
              </Button>
            </Box>
          </form>
        </S.ModalBox>
      </Modal>

      <Modal open={abrirDelecao} onClose={fecharDeletar}>
        <S.ModalBox>
          <Typography variant="h6" component="h2">
            Tem certeza de que deseja excluir este cliente?
          </Typography>
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button
              onClick={fecharDeletar}
              color="secondary"
              sx={{ marginRight: 2 }}
            >
              Cancelar
            </Button>
            <Button variant="contained" color="error" onClick={removerCliente}>
              Confirmar
            </Button>
          </Box>
        </S.ModalBox>
      </Modal>
    </div>
  );
};

export default Clientes;
