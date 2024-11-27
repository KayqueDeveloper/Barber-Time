import axios from "axios";
import { useState, useEffect } from "react";
import { Servico } from "../../Models/Tipos";
import { AlertColor } from "@mui/material";
import { FormatarSalario } from "../../Helpers/validacoes.ts";

interface ServicosResponse {
  servicos: Servico[];
  totalPages: number;
}
export const useServicos = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [servico, setServico] = useState<Servico | null>(null);
  const [abrir, setAbrir] = useState<boolean>(false);
  const [abrirEdicao, setAbrirEdicao] = useState<boolean>(false);
  const [nome, setNome] = useState<string>("");
  const [preco, setPreco] = useState<string>("");
  const [duracao, setDuracao] = useState<string>("");
  const [searchTermo, setSearchTermo] = useState<string>("");
  const [pagina, setPagina] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const definirTermo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermo(event.target.value);
    setPagina(1);
  };

  const mudarDePagina = (_, value: number) => {
    setPagina(value);
  };

  const abrirEditor = (servico: Servico) => {
    setServico(servico);
    setNome(servico?.nome || "");
    setPreco(servico?.preco.toString() || "");
    setDuracao(servico?.duracao.toString() || "");
    setAbrirEdicao(true);
  };

  const fecharModal = () => {
    setNome("");
    setPreco("");
    setDuracao("");
    setAbrir(false);
    setAbrirEdicao(false);
  };

  const definirSalario = (e) => {
    let numero = Number.parseFloat(e?.target?.value?.replace(/\D/g, ""));
    if (isNaN(numero)) {
      numero = 0;
    }
    setPreco((numero / 100).toString());
  };

  const salvarServico = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resposta = await axios.post<Servico>(
        "http://localhost:8080/servicos",
        {
          nome,
          preco: parseFloat(preco),
          duracao: parseInt(duracao, 10),
        }
      );
      showSnackbar("Dados cadastrados com sucesso!", "success");

      setServicos([...servicos, resposta.data]);
      fecharModal();
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao registrar servico, entre em contato com os desenvolvedores!",
          "error"
        );
        return;
      } else if (erro.status === 400) {
        showSnackbar("Dados enviados estão invalidos", "error");
      }
      showSnackbar("Erro ao registrar servico, tente novamente.", "error");
      return;
    }
    return;
  };

  const enviarEdicao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!servico) return;
    try {
      await axios.put(`http://localhost:8080/servicos/${servico.id}`, {
        nome,
        preco: parseFloat(preco),
        duracao: parseInt(duracao, 10),
      });
      showSnackbar("Dados atualizados com sucesso!", "success");
      buscarServicos(pagina, searchTermo);
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao atualizar serviço, entre em contato com os administradores!",
          "error"
        );
        return;
      } else if (erro.status === 400) {
        showSnackbar("Dados enviados estão invalidos", "error");
      }
      showSnackbar("Erro ao registrar serviço, tente novamente.", "error");
      return;
    }
    fecharModal();
  };

  const removerServico = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/servicos/${id}`);
      showSnackbar("Serviço removido com sucesso!", "success");

      setServicos(servicos.filter((servico) => servico.id !== id));
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao deletar serviço, entre em contato com os desenvolvedores!",
          "error"
        );
        return;
      } else if (erro.status === 404) {
        showSnackbar(
          "Esse serviço já não consta nos registros, tente atualizar a página",
          "error"
        );
      }
      showSnackbar("Erro ao remover serviço, tente novamente.", "error");
      return;
    }
  };

  const buscarServicos = async (pagina: number, termo: string = "") => {
    try {
      const resposta = await axios.get<ServicosResponse>(
        "http://localhost:8080/servicos",
        {
          params: {
            page: pagina,
            search: termo,
          },
        }
      );
      setServicos(resposta.data.servicos);
      setTotalPaginas(resposta.data.totalPages);
    } catch (error) {
      showSnackbar("Erro ao buscar dados no servidor", "error");
    }
  };

  useEffect(() => {
    buscarServicos(pagina, searchTermo);
  }, [pagina, searchTermo]);

  return {
    searchTermo,
    definirTermo,
    abrirModal: () => setAbrir(true),
    servicos,
    abrirEditor,
    removerServico,
    totalPaginas,
    pagina,
    mudarDePagina,
    abrir,
    abrirEdicao,
    fecharModal,
    enviarEdicao,
    salvarServico,
    nome,
    setNome,
    preco,
    definirSalario,
    duracao,
    setDuracao,
    FormatarSalario,
    snackbarSeverity,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
  };
};
