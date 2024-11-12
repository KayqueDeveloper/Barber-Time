// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Agendamentos from "./Agendamentos";
import Clientes from "./Clientes";
import Servicos from "./Servicos";
import Funcionarios from "./Funcionarios";
import Relatorios from "./Relatorios";
import Header from "./Header";

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
