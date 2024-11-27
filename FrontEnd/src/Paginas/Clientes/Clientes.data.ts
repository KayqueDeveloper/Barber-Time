import axios from "axios";
import { useState, useEffect } from "react";
import { validarCPF, verificarCpf } from "../../Helpers/validacoes.ts";
import { Cliente } from "../../Models/Tipos";
import { AlertColor } from "@mui/material";

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cliente, setCliente] = useState<Cliente>({
    id: 0, // Valor inicial para id
    nome: "",
    telefone: "",
    email: "",
    criado_em: "",
    cpf: "",
    rua: "",
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
  });
  const [abrir, setAbrir] = useState(false);
  const [abrirEdicao, setAbrirEdicao] = useState(false);
  const [erro, setErro] = useState("");
  const [searchTermo, setSearchTermo] = useState(""); // Termo de pesquisa
  const [pagina, setPagina] = useState<number>(1); // Página atual
  const [totalPaginas, setTotalPaginas] = useState<number>(1); // Total de páginas
  const [cpfErro, setCpfErro] = useState(false);
  const [cpfExiste, setCpfExiste] = useState("");
  const [abrirDelecao, setAbrirDelecao] = useState(false);
  const [ClienteParaExcluir, setClienteParaExcluir] = useState<number | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const deletar = (id: number) => {
    setClienteParaExcluir(id);
    setAbrirDelecao(true);
  };

  const fecharDeletar = () => {
    setClienteParaExcluir(null);
    setAbrirDelecao(false);
  };

  const pesquisar = (evento: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermo(evento.target.value);
    setPagina(1);
  };

  const fecharModal = () => {
    resetarEstados();
    setAbrir(false);
    setAbrirEdicao(false);
  };

  const validarEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const resetarEstados = () => {
    setCliente({
      id: 0, // Valor inicial para id
      nome: "",
      telefone: "",
      email: "",
      criado_em: "",
      cpf: "",
    });
    setCpfErro(false);
    setCpfExiste("");
  };

  const abrirEditar = (cliente: Cliente) => {
    setCliente(cliente);
    setAbrirEdicao(true);
  };

  const definirCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    const somenteNumeros = e.target.value.replace(/\D/g, "");

    const cpfFormatado = somenteNumeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setCliente({ ...cliente, cpf: cpfFormatado });

    if (!validarCPF(e.target.value)) {
      setCpfErro(true);
      return;
    }
    setCpfErro(false);
    setCpfExiste("");
  };

  const buscarEnderecoPorCEP = async (cep: string) => {
    setCliente({ ...cliente, cep });

    if (cep.length > 8) {
      try {
        const resposta = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );
        if (resposta.data.erro) {
          showSnackbar("CEP não encontrado", "error");
        } else {
          setCliente({
            ...cliente,
            rua: resposta.data.logradouro,
            bairro: resposta.data.bairro,
            cidade: resposta.data.localidade,
            estado: resposta.data.uf,
            cep,
          });
        }
      } catch (erro) {
        if (erro.status === 500) {
          showSnackbar(
            "Erro no servidor ao buscar CEP, entre em contato com os administradores!",
            "error"
          );
          return;
        } else if (erro.status === 400) {
          showSnackbar("CEP invalido", "error");
          return;
        }
        console.log(erro);
        showSnackbar("CEP não encontrado, tente novamente.", "error");
        return;
      }
    }
  };

  const enviarDados = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCPF(cliente?.cpf)) {
      setCpfErro(true);
      return;
    }

    const cpfDisponivel = await verificarCpf(
      cliente?.id,
      cliente?.cpf,
      "cliente",
      setCpfExiste
    );
    if (!cpfDisponivel) {
      return;
    }

    if (!validarEmail(cliente?.email)) {
      setErro("Email inválido");
      return;
    }

    if (!abrirEdicao) {
      try {
        await axios.post("http://localhost:8080/clientes", cliente);
        fecharModal();
        showSnackbar("Dados do cliente cadastrados com sucesso!", "success");
        resetarEstados();
      } catch (erro) {
        if (erro.status === 500) {
          showSnackbar(
            "Erro no servidor ao registrar cliente, entre em contato com os administradores!",
            "error"
          );
          return;
        } else if (erro.status === 400) {
          showSnackbar("Dados enviados estão invalidos", "error");
        }
        showSnackbar("Erro ao registrar cliente, tente novamente.", "error");
        return;
      }
      return;
    }
    try {
      await axios.put(`http://localhost:8080/clientes/${cliente?.id}`, cliente);
      fecharModal();
      showSnackbar("Dados do cliente atualizados com sucesso!", "success");
      resetarEstados();
      buscarClientes(pagina, searchTermo);
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao atualizar cliente, entre em contato com os administradores!",
          "error"
        );
        return;
      } else if (erro.status === 400) {
        showSnackbar("Dados enviados estão invalidos", "error");
      }
      showSnackbar("Erro ao registrar cliente, tente novamente.", "error");
      return;
    }
    return;
  };

  const removerCliente = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/clientes/${ClienteParaExcluir}`
      );
      showSnackbar("Dados do cliente removidos com sucesso!", "success");
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao deletar cliente, entre em contato com os administradores!",
          "error"
        );
        return;
      } else if (erro.status === 404) {
        showSnackbar(
          "Esse cliente já não consta nos registros, tente atualizar a página",
          "error"
        );
      }
      showSnackbar("Erro ao atualizar cliente, tente novamente.", "error");
      return;
    }
    buscarClientes(pagina, searchTermo);
    fecharDeletar();
  };

  const buscarClientes = async (pagina: number, termo: string = "") => {
    try {
      const resposta = await axios.get("http://localhost:8080/clientes", {
        params: {
          page: pagina,
          limit: 9,
          search: termo,
        },
      });
      const { clientes, currentPage, totalPages } = resposta.data;
      setClientes(clientes);
      setPagina(currentPage);
      setTotalPaginas(totalPages);
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao buscar clientes, entre em contato com os administradores!",
          "error"
        );
        return;
      } else if (erro.status === 404) {
        showSnackbar(
          "Nenhum cliente não consta nos registros, tente atualizar a página",
          "error"
        );
      }
      showSnackbar("Erro ao buscar clientes, tente novamente.", "error");
      return;
    }
  };

  useEffect(() => {
    buscarClientes(pagina, searchTermo);
  }, [pagina, searchTermo]);

  return {
    erro,
    searchTermo,
    abriModal: () => setAbrir(true),
    clientes,
    abrirEditar,
    deletar,
    totalPaginas,
    pagina,
    mudarDePagina: (_: React.ChangeEvent<unknown>, valor: number) =>
      setPagina(valor),
    abrir,
    abrirEdicao,
    fecharModal,
    enviarDados,
    cliente,
    setCliente,
    definirCPF,
    cpfErro,
    cpfExiste,
    buscarEnderecoPorCEP,
    abrirDelecao,
    fecharDeletar,
    removerCliente,
    pesquisar,
    snackbarSeverity,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
  };
};
