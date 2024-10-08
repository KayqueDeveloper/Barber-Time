// Servicos.js
import React, { useState } from "react";
import "./Servicos.css";

const Servicos = () => {
  // Estado para armazenar os serviços
  const [servicos, setServicos] = useState([
    { id: 1, nome: "Corte de Cabelo", preco: "R$ 50,00", duracao: "30 minutos" },
    { id: 2, nome: "Barba", preco: "R$ 30,00", duracao: "20 minutos" },
  ]);

  // Função para remover serviço
  const removerServico = (id) => {
    setServicos(servicos.filter((servico) => servico.id !== id));
  };

  return (
    <div className="servicos-container">
      <h2>Gerenciamento de Serviços</h2>

      <table className="servicos-table">
        <thead>
          <tr>
            <th>Serviço</th>
            <th>Preço</th>
            <th>Duração</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map((servico) => (
            <tr key={servico.id}>
              <td>{servico.nome}</td>
              <td>{servico.preco}</td>
              <td>{servico.duracao}</td>
              <td>
                <button className="edit-button">Editar</button>
                <button
                  className="delete-button"
                  onClick={() => removerServico(servico.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-button">Adicionar Serviço</button>
    </div>
  );
};

export default Servicos;
