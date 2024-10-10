// Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

const Dashboard = () => {

  const navigate = useNavigate()

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="metrics">
        <div className="metric-box">
          <h3>Agendamentos Hoje</h3>
          <p>25</p>
        </div>
        <div className="metric-box">
          <h3>Clientes Atendidos</h3>
          <p>15</p>
        </div>
        <div className="metric-box">
          <h3>Serviços Oferecidos</h3>
          <p>5</p>
        </div>
        <div className="metric-box">
          <h3>Faturamento do Dia</h3>
          <p>R$ 750,00</p>
        </div>
      </div>

      <div className="actions">
        <h3>Gerenciar</h3>
        <div className="action-buttons">
          <button className="action-button" onClick={() => navigate("/agendamentos")}>Agendamentos</button>
          <button className="action-button" onClick={() => navigate("/clientes")}>Clientes</button>
          <button className="action-button" onClick={() => navigate("/servicos")}>Serviços</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
