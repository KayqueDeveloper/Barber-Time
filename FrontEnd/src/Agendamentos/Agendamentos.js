// Agendamentos.js
import React, { useState } from "react";
import "./Agendamentos.css";

const Agendamentos = () => {
  // Estado para armazenar os agendamentos
  const [agendamentos, setAgendamentos] = useState([
    { id: 1, cliente: "João Silva", data: "2024-10-04", hora: "14:00", servico: "Corte de Cabelo" },
    { id: 2, cliente: "Maria Souza", data: "2024-10-04", hora: "15:00", servico: "Barba" },
  ]);

  // Função para remover agendamentos
  const removerAgendamento = (id) => {
    setAgendamentos(agendamentos.filter((agendamento) => agendamento.id !== id));
  };

  return (
    <div className="agendamentos-container">
      <h2>Gerenciamento de Agendamentos</h2>

      <table className="agendamentos-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Serviço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.map((agendamento) => (
            <tr key={agendamento.id}>
              <td>{agendamento.cliente}</td>
              <td>{agendamento.data}</td>
              <td>{agendamento.hora}</td>
              <td>{agendamento.servico}</td>
              <td>
                <button className="edit-button">Editar</button>
                <button
                  className="delete-button"
                  onClick={() => removerAgendamento(agendamento.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-button">Adicionar Agendamento</button>
    </div>
  );
};

export default Agendamentos;
