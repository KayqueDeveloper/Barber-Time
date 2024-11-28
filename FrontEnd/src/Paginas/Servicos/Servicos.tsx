import React from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
  Grid,
  Pagination,
  Alert,
  Snackbar,
  CardActions,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import "./Servicos.css";
import { useServicos } from "./servico.data.ts";

import * as S from "./Servicos.style.ts";

const Servicos = () => {
  const {
    searchTermo,
    definirTermo,
    abrirModal,
    servicos,
    abrirEditor,
    removerServico,
    totalPaginas,
    pagina,
    mudarDePagina,
    abrir,
    abrirEdicao,
    fecharModal,
    enviarEdicao,
    salvarServico,
    nome,
    setNome,
    preco,
    definirSalario,
    duracao,
    setDuracao,
    FormatarSalario,
    snackbarSeverity,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
  } = useServicos();

  return (
    <div className="servicos-container">
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
        Gerenciamento de Serviços
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <TextField
          label="Buscar por Nome"
          value={searchTermo}
          onChange={definirTermo}
          placeholder="Digite o nome do serviço"
          variant="filled"
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
        <S.BotaoAdd variant="contained" color="primary" onClick={abrirModal}>
          Adicionar Serviço
        </S.BotaoAdd>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Grid container spacing={2}>
          {servicos?.map((servico) => (
            <Grid item xs={12} sm={6} md={4} key={servico.id}>
              <S.CardContainer
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
                    {servico.nome}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <span style={{ fontWeight: "bold", color: "white" }}>
                      Preço:
                    </span>{" "}
                    {FormatarSalario(servico.preco)}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <span style={{ fontWeight: "bold", color: "white" }}>
                      Duração:
                    </span>{" "}
                    {servico.duracao} min
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => abrirEditor(servico)}
                    color="secondary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => removerServico(servico.id)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </S.CardContainer>
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
            {abrirEdicao ? "Editar Serviço" : "Adicionar Serviço"}
          </Typography>
          <form onSubmit={abrirEdicao ? enviarEdicao : salvarServico}>
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
              onChange={definirSalario}
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
                onClick={fecharModal}
                color="secondary"
                sx={{ marginRight: 2 }}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {abrirEdicao ? "Salvar" : "Adicionar"}
              </Button>
            </Box>
          </form>
        </S.ModalBox>
      </Modal>
    </div>
  );
};

export default Servicos;
