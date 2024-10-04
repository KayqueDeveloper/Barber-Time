// Funcionarios.js
import React, { useState } from "react";
import "./Funcionarios.css";

const Funcionarios = () => {
  // Estado para armazenar os funcionários
  const [funcionarios, setFuncionarios] = useState([
    { id: 1, nome: "Carlos Santos", especialidade: "Corte de cabelo", telefone: "(31) 99999-9999" },
    { id: 2, nome: "Pedro Lima", especialidade: "Barba", telefone: "(31) 98888-8888" },
  ]);

  // Função para remover funcionário
  const removerFuncionario = (id) => {
    setFuncionarios(funcionarios.filter((funcionario) => funcionario.id !== id));
  };

  return (
    <div className="funcionarios-container">
      <h2>Gerenciamento de Funcionários</h2>

      <table className="funcionarios-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Especialidade</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((funcionario) => (
            <tr key={funcionario.id}>
              <td>{funcionario.nome}</td>
              <td>{funcionario.especialidade}</td>
              <td>{funcionario.telefone}</td>
              <td>
                <button className="edit-button">Editar</button>
                <button
                  className="delete-button"
                  onClick={() => removerFuncionario(funcionario.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-button">Adicionar Funcionário</button>
    </div>
  );
};

export default Funcionarios;
