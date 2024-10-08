// Configuracoes.js
import React, { useState } from "react";
import "./Configuracoes.css";

const Configuracoes = () => {
  // Estados para armazenar as configurações
  const [horarioAbertura, setHorarioAbertura] = useState("08:00");
  const [horarioFechamento, setHorarioFechamento] = useState("18:00");
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  // Função para salvar as configurações
  const salvarConfiguracoes = () => {
    console.log("Configurações Salvas:");
    console.log("Horário de Abertura:", horarioAbertura);
    console.log("Horário de Fechamento:", horarioFechamento);
    console.log("Notificações Ativas:", notificacoesAtivas);
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="configuracoes-container">
      <h2>Configurações do Sistema</h2>

      <div className="form-configuracoes">
        <div className="form-group">
          <label>Horário de Abertura:</label>
          <input
            type="time"
            value={horarioAbertura}
            onChange={(e) => setHorarioAbertura(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Horário de Fechamento:</label>
          <input
            type="time"
            value={horarioFechamento}
            onChange={(e) => setHorarioFechamento(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Notificações:</label>
          <select
            value={notificacoesAtivas}
            onChange={(e) => setNotificacoesAtivas(e.target.value === "true")}
          >
            <option value="true">Ativadas</option>
            <option value="false">Desativadas</option>
          </select>
        </div>

        <button className="save-button" onClick={salvarConfiguracoes}>
          Salvar Configurações
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;
