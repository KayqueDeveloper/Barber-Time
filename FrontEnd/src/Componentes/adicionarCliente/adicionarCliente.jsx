// AdicionarCliente.js
import React, { useState } from "react";
import axios from "axios";

const AdicionarCliente = ({ onClienteAdicionado }) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/clientes", {
        nome,
        telefone,
        email,
      });
      onClienteAdicionado(response.data); // Atualiza a lista de clientes
      setNome("");
      setTelefone("");
      setEmail("");
    } catch (error) {
      setError("Erro ao adicionar cliente");
    }
  };

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <h2>Adicionar Cliente</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Telefone:</label>
        <input
          type="text"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit">Adicionar</button>
    </form>
  );
};

export default AdicionarCliente;
