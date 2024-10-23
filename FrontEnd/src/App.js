// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Agendamentos from "./Agendamentos";
import Clientes from "./Clientes";
import Servicos from "./Servicos";
import Funcionarios from "./Funcionarios";
import Relatorios from "./Relatorios";
import Configuracoes from "./Configuracoes";
import Header from "./Header";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <>
                <Header />
                <Dashboard />
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
          <Route
            path="/configuracoes"
            element={
              <>
                <Header />
                <Configuracoes />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
