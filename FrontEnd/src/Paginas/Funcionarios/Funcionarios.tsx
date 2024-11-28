import React from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { Card, CardContent, CardActions, Grid } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Pagination from "@mui/material/Pagination";
import "./Funcionarios.css";
import styled from "styled-components";
import { FormatarSalario } from "../../Helpers/validacoes.ts";
import { useFuncionario } from "./Funcionarios.data.ts";

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

const Funcionarios: React.FC = () => {
  const {
    searchTermo,
    buscar,
    abrirmodal,
    funcionarios,
    mudarPagina,
    abrirModalEdicao,
    setAbrirDeletar,
    enviarDados,
    abrirDeletar,
    removerFuncionario,
    setarSalario,
    setarCPF,
    cpfExiste,
    cpfErro,
    abrirEdicao,
    setFuncionarioParaExcluir,
    setFuncionario,
    abir,
    totalPaginas,
    fecharModal,
    pagina,
    funcionario,
    snackbarSeverity,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
  } = useFuncionario();

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
        Gerenciamento de Funcionários
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
          onChange={buscar}
          placeholder="Digite o nome do funcionário"
          variant="filled"
          style={{ backgroundColor: "#fff", borderRadius: "8px" }}
        />
        <BotaoAdd variant="contained" color="primary" onClick={abrirmodal}>
          Adicionar Funcionário
        </BotaoAdd>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Grid container spacing={2}>
          {funcionarios?.map((funcionario) => (
            <Grid item xs={12} sm={6} md={4} key={funcionario.id}>
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
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      wordWrap: "break-word",
                      width: "100%",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {funcionario?.nome?.substring(0, 24)}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <span style={{ fontWeight: "bold", color: "white" }}>
                      Cargo:
                    </span>{" "}
                    {funcionario?.cargo}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <span style={{ fontWeight: "bold", color: "white" }}>
                      Salario:
                    </span>{" "}
                    {FormatarSalario(funcionario.salario)}
                  </Typography>
                  <Typography variant="body2" color="white">
                    <span style={{ fontWeight: "bold", color: "white" }}>
                      CPF:
                    </span>{" "}
                    {funcionario.cpf}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => abrirModalEdicao(funcionario)}
                    color="secondary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setAbrirDeletar(true);
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
          count={totalPaginas}
          page={pagina}
          onChange={mudarPagina}
          color="secondary"
          sx={{ marginTop: "20px" }}
        />
      </Box>

      <Modal open={abir || abrirEdicao} onClose={fecharModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            {abrirEdicao ? "Editar Funcionário" : "Adicionar Funcionário"}
          </Typography>

          <Typography variant="body1" gutterBottom color="info">
            Os campos obrigatórios estão marcados com '*'
          </Typography>
          <form onSubmit={enviarDados}>
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
              onChange={setarCPF}
              margin="normal"
              required
              error={cpfErro || cpfExiste !== ""}
              helperText={cpfExiste ? cpfExiste : cpfErro && "CPF inválido"}
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
              onChange={setarSalario}
              margin="normal"
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
        </Box>
      </Modal>
      <Modal open={abrirDeletar} onClose={fecharModal}>
        <Box sx={{ ...modalStyle, height: "120px" }}>
          <Typography variant="h6" component="h2">
            Tem certeza de que deseja excluir o funcionario {funcionario?.nome}{" "}
            ?
          </Typography>
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button
              onClick={fecharModal}
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
