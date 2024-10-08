// Relatorios.js
import React, { useState } from "react";
import "./Relatorios.css";

const Relatorios = () => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [relatorio, setRelatorio] = useState(null);

  // Função para gerar relatório (simulação)
  const gerarRelatorio = () => {
    // Lógica para gerar relatório com base nas datas
    setRelatorio({
      faturamento: "R$ 5.000,00",
      agendamentos: 120,
      clientesAtendidos: 100,
    });
  };

  return (
    <div className="relatorios-container">
      <h2>Relatórios</h2>
      <div className="filtro-relatorios">
        <label>Data Início:</label>
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
        />
        <label>Data Fim:</label>
        <input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
        />
        <button className="generate-button" onClick={gerarRelatorio}>
          Gerar Relatório
        </button>
      </div>

      {relatorio && (
        <div className="relatorio-result">
          <h3>Resultados:</h3>
          <p><strong>Faturamento:</strong> {relatorio.faturamento}</p>
          <p><strong>Agendamentos:</strong> {relatorio.agendamentos}</p>
          <p><strong>Clientes Atendidos:</strong> {relatorio.clientesAtendidos}</p>
        </div>
      )}

      <div className="export-buttons">
        <button className="export-button">Exportar em PDF</button>
        <button className="export-button">Exportar em Excel</button>
      </div>
    </div>
  );
};

export default Relatorios;
