// Header.js
import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "./Header.css";
import {  useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate()
  return (
    <AppBar position="static" className="header-appbar">
      <Toolbar>

        {/* Nome do Sistema/Empresa */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Barber Management System
        </Typography>

        {/* Botões de Navegação */}
        <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
        <Button color="inherit" onClick={() => navigate('/clientes')}>Clientes</Button>
        <Button color="inherit" onClick={() => navigate('/servicos')}>Serviços</Button>
        <Button color="inherit" onClick={() => navigate('/funcionarios')}>Funcionários</Button>
        <Button color="inherit" onClick={() => navigate('/agendamentos')}>Agendamentos</Button>
        <Button color="inherit" onClick={() => navigate('/relatorios')}>Relatórios</Button>
        <Button color="inherit"onClick={() => navigate('/configuracoes')} >Configurações</Button>

        {/* Ícone de Perfil */}
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
