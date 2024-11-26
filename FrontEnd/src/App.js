// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Agendamentos } from "./Paginas/Agendamentos/Agendamentos.tsx";
import Login from "./Paginas/Login/Login.tsx";
import Header from "./Componentes/Header/Header.tsx";
import Clientes from "./Paginas/Clientes/Clientes.tsx";
import Servicos from "./Paginas/Servicos/Servicos.tsx";
import Funcionarios from "./Paginas/Funcionarios/Funcionarios.tsx";
import Relatorios from "./Paginas/Relatorios/Relatorios.tsx";
import Home from "./Paginas/Home/Home.tsx";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
          <Route
            path="/agendamentos"
            element={
              <>
                <Header />
                <Agendamentos />
              </>
            }
          />
          <Route
            path="/clientes"
            element={
              <>
                <Header />
                <Clientes />
              </>
            }
          />
          <Route
            path="/servicos"
            element={
              <>
                <Header />
                <Servicos />
              </>
            }
          />
          <Route
            path="/funcionarios"
            element={
              <>
                <Header />
                <Funcionarios />
              </>
            }
          />
          <Route
            path="/relatorios"
            element={
              <>
                <Header />
                <Relatorios />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
