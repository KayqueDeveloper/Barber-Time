// Header.js
import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <h1>Gerenciamento de Barbearia</h1>
      <nav>
        <ul className="nav-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/agendamentos">Agendamentos</Link></li>
          <li><Link to="/clientes">Clientes</Link></li>
          <li><Link to="/servicos">Serviços</Link></li>
          <li><Link to="/funcionarios">Funcionários</Link></li>
          <li><Link to="/relatorios">Relatórios</Link></li>
          <li><Link to="/configuracoes">Configurações</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
