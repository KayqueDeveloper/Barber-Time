import axios from "axios";
import { useState, useEffect } from "react";
import { verificarCpf, validarCPF } from "../../Helpers/validacoes.ts";
import { Funcionario } from "../../Models/Tipos";
import { AlertColor } from "@mui/material";

const funcionarioLimpo = {
  id: 0, // Valor inicial para id
  nome: "",
  especialidade: " ",
  telefone: "",
  criado_em: "",
  cpf: "",
};
export const useFuncionario = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [funcionario, setFuncionario] = useState<Funcionario>(funcionarioLimpo);
  const [abir, setAbrir] = useState<boolean>(false);
  const [abrirEdicao, setAbrirEdicao] = useState<boolean>(false);
  const [searchTermo, setSearchTermo] = useState<string>("");
  const [pagina, setPagina] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [cpfExiste, setCpfExiste] = useState<string>("");
  const [cpfErro, setCpfErro] = useState<boolean>(false);
  const [abrirDeletar, setAbrirDeletar] = useState<boolean>(false);
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] =
    useState<number>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const setarSalario = (e) => {
    let numero = Number.parseFloat(e?.target?.value?.replace(/\D/g, ""));
    if (isNaN(numero)) {
      numero = 0;
    }
    setFuncionario({ ...funcionario, salario: numero / 100 });
  };

  const setarCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const somenteNumeros = e.target.value.replace(/\D/g, "");

    const cpf = somenteNumeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setFuncionario({ ...funcionario, cpf });

    if (!validarCPF(e.target.value)) {
      setCpfErro(true);
      return;
    }
    setCpfErro(false);
    setCpfExiste("");
  };

  const buscar = (evento: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermo(evento.target.value);
    setPagina(1);
  };

  const mudarPagina = (_, valor: number) => {
    setPagina(valor);
  };

  const abrirmodal = () => setAbrir(true);

  const fecharModal = () => {
    resetarForm();
    setAbrir(false);
    setAbrirEdicao(false);
    setAbrirDeletar(false);
  };

  const resetarForm = () => {
    setFuncionario(funcionarioLimpo);
    setCpfErro(false);
  };

  const abrirModalEdicao = async (funcionario: Funcionario) => {
    setFuncionario(funcionario);
    setAbrirEdicao(true);
  };

  const enviarDados = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!funcionario?.cpf) {
      setCpfErro(true);
      return;
    }

    const cpfDisponivel = await verificarCpf(
      funcionario?.id,
      funcionario?.cpf,
      "funcionario",
      setCpfExiste
    );
    if (!cpfDisponivel) {
      return;
    }

    if (abrirEdicao) {
      try {
        await axios.put(
          `http://localhost:8080/funcionarios/${funcionario?.id}`,
          funcionario
        );
        resetarForm();
        setAbrirEdicao(false);
        buscarFuncionarios(pagina, searchTermo);
      } catch (erro) {
        if (erro.status === 500) {
          showSnackbar(
            "Erro no servidor ao registrar funcionario, Tente Novamente!",
            "error"
          );
          return;
        } else if (erro.status === 400) {
          showSnackbar("Dados enviados estão invalidos", "error");
        }
        showSnackbar(
          "Erro ao registrar funcionario, tente novamente.",
          "error"
        );
        return;
      }
      return;
    }

    try {
      await axios.post("http://localhost:8080/funcionarios", funcionario);
      fecharModal();
      resetarForm();
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao atualizar funcionario, entre em contato com os administradores!",
          "error"
        );
        return;
      } else if (erro.status === 400) {
        showSnackbar("Dados enviados estão invalidos", "error");
      }
      showSnackbar("Erro ao registrar funcionario, tente novamente.", "error");
      return;
    }
    return;
  };

  const removerFuncionario = async () => {
    try {
      if (funcionarioParaExcluir) {
        await axios.delete(
          `http://localhost:8080/funcionarios/${funcionarioParaExcluir}`
        );
        setFuncionarios(
          funcionarios.filter(
            (funcionario) => funcionario.id !== funcionarioParaExcluir
          )
        );
        buscarFuncionarios(pagina, searchTermo);
        setAbrirDeletar(false);
      }
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao deletar funcionario, entre em contato com os administradores!",
          "error"
        );
        return;
      } else if (erro.status === 404) {
        showSnackbar(
          "Esse funcionario já não consta nos registros, tente atualizar a página",
          "error"
        );
      }
      showSnackbar("Erro ao remover funcionario, tente novamente.", "error");
      return;
    }
  };

  const buscarFuncionarios = async (pagina: number, termo: string = "") => {
    try {
      const resposta = await axios.get("http://localhost:8080/funcionarios", {
        params: {
          page: pagina,
          limit: 9,
          search: termo,
        },
      });
      const { funcionarios, currentPage, totalPages } = resposta.data;
      setFuncionarios(funcionarios);
      setPagina(currentPage);
      setTotalPaginas(totalPages);
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao buscar funcionarios, entre em contato com os desenvolvedores!",
          "error"
        );
        return;
      } else if (erro.status === 404) {
        showSnackbar(
          "Nenhum funcionarios não consta nos registros, tente atualizar a página",
          "error"
        );
      }
      showSnackbar("Erro ao buscar funcionarios, tente novamente.", "error");
      return;
    }
  };

  useEffect(() => {
    buscarFuncionarios(pagina, searchTermo);
  }, [pagina, searchTermo]);

  return {
    searchTermo,
    buscar,
    abrirmodal,
    funcionarios,
    mudarPagina,
    abrirModalEdicao,
    resetarForm,
    enviarDados,
    abrirDeletar,
    setAbrirDeletar,
    removerFuncionario,
    setarSalario,
    setarCPF,
    cpfExiste,
    cpfErro,
    abrirEdicao,
    setAbrirEdicao,
    funcionarioParaExcluir,
    setFuncionarioParaExcluir,
    setFuncionario,
    abir,
    totalPaginas,
    fecharModal,
    setAbrir,
    pagina,
    funcionario,
    snackbarSeverity,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
  };
};
