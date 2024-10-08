// Clientes.js
import React, { useState } from "react";
import "./Clientes.css";

const Clientes = () => {
  // Estado para armazenar os clientes
  const [clientes, setClientes] = useState([
    { id: 1, nome: "João Silva", telefone: "(31) 99999-9999", email: "joao@email.com" },
    { id: 2, nome: "Maria Souza", telefone: "(31) 98888-8888", email: "maria@email.com" },
  ]);

  // Função para remover cliente
  const removerCliente = (id) => {
    setClientes(clientes.filter((cliente) => cliente.id !== id));
  };

  return (
    <div className="clientes-container">
      <h2>Gerenciamento de Clientes</h2>

      <table className="clientes-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.email}</td>
              <td>
                <button className="edit-button">Editar</button>
                <button
                  className="delete-button"
                  onClick={() => removerCliente(cliente.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-button">Adicionar Cliente</button>
    </div>
  );
};

export default Clientes;
