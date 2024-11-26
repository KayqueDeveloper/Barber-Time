import axios from "axios";
import { momentLocalizer } from "react-big-calendar";

import { useState, useEffect, useCallback } from "react";
import { Cliente, Servico, Funcionario, Agendamento } from "../../Models/Tipos";
import moment from "moment";
import { AlertColor } from "@mui/material";

const localizer = momentLocalizer(moment);

const Status = ["pendente", "concluido", "em andamento"];

interface Event {
  title: string;
  start: Date;
  end: Date;
  agendamento: Agendamento;
}

const servicoLimpo = {
  id: 0,
  criado_em: "",
  nome: "",
  preco: 0,
  duracao: 0,
};

export const useAgendamentos = () => {
  const [eventos, setEventos] = useState<Event[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [servico, setServico] = useState<Servico>(servicoLimpo);
  const [status, setStatus] = useState("");
  const [verModal, setverModal] = useState(false);
  const [slotSelecionado, setSlotSelecionado] = useState<any>();
  const [cliente, setCliente] = useState("");
  const [funcionario, setFuncionario] = useState<number | undefined>(undefined);
  const [verAgendamento, setVerAgendamento] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [agendamento, setAgendamento] = useState<Agendamento>();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const alterarServico = (evento) => {
    const serv = servicos?.find((s) => s.id === evento.target.value);
    setServico(serv as Servico);
  };

  const alterarFuncionario = (evento) => {
    const funcionarioSelecionado = evento.target.value as number;

    const eventosFuncionario = eventos.filter((agendamento) =>
      agendamento?.agendamento
        ? agendamento?.agendamento?.funcionario_id === funcionarioSelecionado
        : false
    );

    const dataConflitante = eventosFuncionario.some((elemento) => {
      const dataSelecionada = new Date(slotSelecionado?.start || "").getTime();
      const agendamentoDataInicio = new Date(
        elemento?.agendamento?.data_agendamento || ""
      ).getTime();
      const agendamentoDataFinal = new Date(
        elemento?.agendamento?.data_final_agendamento || ""
      ).getTime();

      return (
        dataSelecionada >= agendamentoDataInicio &&
        dataSelecionada <= agendamentoDataFinal
      );
    });

    if (dataConflitante) {
      showSnackbar(
        "Conflito: o barbeiro já está com o horário ocupado.",
        "error"
      );
      setFuncionario(undefined);
    } else {
      setFuncionario(funcionarioSelecionado);
    }
  };

  const alterarCliente = (evento) => {
    const clienteSelecionado = evento.target.value;

    const eventosCliente = eventos.filter((agendamento) =>
      agendamento?.agendamento
        ? agendamento?.agendamento?.cliente_id === clienteSelecionado
        : false
    );

    const dataConflitante = eventosCliente.some((elemento) => {
      const dataSelecionada = new Date(slotSelecionado?.start || "").getTime();
      const agendamentoDataInicio = new Date(
        elemento?.agendamento?.data_agendamento || ""
      ).getTime();
      const agendamentoDataFinal = new Date(
        elemento?.agendamento?.data_final_agendamento || ""
      ).getTime();

      return (
        dataSelecionada >= agendamentoDataInicio &&
        dataSelecionada <= agendamentoDataFinal
      );
    });

    if (dataConflitante) {
      showSnackbar(
        "Conflito: o cliente já está com o horário marcado.",
        "error"
      );
      setCliente("");
    } else {
      setCliente(clienteSelecionado);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const selecaoDeSlot = (slotInfo) => {
    setSlotSelecionado(slotInfo);
    setverModal(true);
  };

  const verEvento = useCallback((evento) => {
    setAgendamento(evento.agendamento as Agendamento);
    setVerAgendamento(true);
  }, []);

  const fecharModal = () => {
    setverModal(false);
    setSlotSelecionado(null);
    setCliente("");
    setFuncionario(undefined);
    setServico(servicoLimpo);
    setStatus("");
  };

  const fecharModalAgendamento = () => {
    setVerAgendamento(false);
    setAgendamento(undefined);
  };

  const acharFuncionario = useCallback(() => {
    const func = funcionarios.find(
      (funcionario) => funcionario?.id === agendamento?.funcionario_id
    );
    return func?.nome || "";
  }, [agendamento?.funcionario_id, funcionarios]);

  const confirmarAgendamento = async () => {
    if (
      JSON.stringify(servico) === JSON.stringify(servicoLimpo) ||
      funcionario === undefined ||
      cliente === "" ||
      status === ""
    ) {
      showSnackbar("Há dados faltando, Preencha todos os campos", "error");
      return;
    }
    setCarregando(true);
    fecharModal();

    if (!slotSelecionado || !servico) return;

    try {
      const dataFinal = new Date(slotSelecionado?.start);
      dataFinal.setMinutes(dataFinal.getMinutes() + servico?.duracao);

      await axios.post("http://localhost:8080/agendamentos", {
        cliente_id: cliente,
        funcionario_id: funcionario,
        servico_id: servico.id,
        status,
        data_agendamento: new Date(slotSelecionado.start).toISOString(),
        data_final_agendamento: dataFinal.toISOString(),
      });

      setCarregando(false);
      showSnackbar("Agendamento realizado com sucesso!", "success");
      buscarAgendamentos();
      return;
    } catch (error) {
      setCarregando(false);

      if (error?.status === 500) {
        setverModal(true);

        showSnackbar(
          "Erro ao cadastrar agendamento, entre em contato com os administradores!",
          "error"
        );
        return;
      } else if (error?.status === 400) {
        setverModal(true);
        showSnackbar("Dados enviados são invalidos", "error");

        return;
      }

      showSnackbar(
        "Erro ao cadastrar agendamento, entre em contato com os administradores!",
        "error"
      );
    }
  };

  const atualizarAgendamento = async (status: string) => {
    setCarregando(true);

    if (!agendamento) return;

    try {
      await axios.put(`http://localhost:8080/agendamentos/${agendamento.id}`, {
        ...agendamento,
        status,
      });
      buscarAgendamentos();
      fecharModalAgendamento();
      setCarregando(false);

      showSnackbar("Agendamento atualizado com sucesso!", "success");
      return;
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao atualizar agendamento, entre em contato com os administradores!",
          "error"
        );
        return;
      } else if (erro.status === 400) {
        showSnackbar("Dados enviados são invalidos", "error");
        return;
      } else if (erro.status === 404) {
        showSnackbar(
          "Esse agendamento já não consta nos registros, tente atualizar a página",
          "error"
        );
      }
      showSnackbar("Erro ao atualizar agendamento, tente novamente.", "error");
      return;
    }
  };

  const deloetarAgendamento = async () => {
    setCarregando(true);
    if (!agendamento) return;

    try {
      await axios.delete(
        `http://localhost:8080/agendamentos/${agendamento.id}`
      );
      buscarAgendamentos();
      fecharModalAgendamento();
      setCarregando(false);

      showSnackbar("Agendamento deletado com sucesso!", "success");
      return;
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao deletar agendamento, entre em contato com os administradores!",
          "error"
        );
        return;
      } else if (erro.status === 404) {
        showSnackbar(
          "Esse agendamento já não consta nos registros, tente atualizar a página",
          "error"
        );
      }
      showSnackbar("Erro ao atualizar agendamento, tente novamente.", "error");
      return;
    }
  };

  const buscarAgendamentos = async () => {
    setCarregando(true);
    try {
      const resposta = await axios.get("http://localhost:8080/agendamentos");
      setCarregando(false);
      console.log(resposta.data);

      const agendamentos = resposta.data.map((agendamento) => ({
        title: ` ${agendamento.nome_cliente} - ${agendamento.nome_servico} (${agendamento?.nome_funcionario}) - ${agendamento.status}`,
        start: new Date(agendamento.data_agendamento),
        end: new Date(agendamento.data_final_agendamento),
        agendamento,
      }));
      setEventos(agendamentos);
      return;
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar("Erro no servidor", "Error");
        return;
      } else if (erro.status === 404) {
        showSnackbar("agendamentos não encontrados", "error");
        return;
      }
      showSnackbar("Erro ao buscar os agendamentos", "error");
      return;
    }
  };

  useEffect(() => {
    setCarregando(true);
    const buscarClientes = async () => {
      try {
        const resposta = await axios.get("http://localhost:8080/clientes");
        setClientes(resposta.data.clientes);

        return;
      } catch (erro) {
        if (erro.status === 500) {
          showSnackbar("Erro no servidor", "error");
          return;
        } else if (erro.status === 404) {
          showSnackbar("clientes não encontrados", "error");
          return;
        }
        return;
      }
    };
    buscarClientes();
    setCarregando(false);
  }, []);

  useEffect(() => {
    setCarregando(true);
    const buscarServicos = async () => {
      try {
        const resposta = await axios.get("http://localhost:8080/servicos");
        setServicos(resposta.data.servicos);
        setServicos(resposta.data.servicos);
        return;
      } catch (erro) {
        if (erro.status === 500) {
          showSnackbar("Erro no servidor", "error");
          return;
        } else if (erro.status === 404) {
          showSnackbar("serviços não encontrados", "error");
          return;
        }
        showSnackbar("Erro ao buscar os serviços no servidor", "error");
        return;
      }
    };
    buscarServicos();
    setCarregando(false);
  }, []);

  useEffect(() => {
    setCarregando(true);
    const buscarFuncionarios = async () => {
      try {
        const resposta = await axios.get<{ funcionarios: Funcionario[] }>(
          "http://localhost:8080/funcionarios",
          {
            params: {
              cargo: "barbeiro",
            },
          }
        );
        setFuncionarios(resposta.data.funcionarios);

        return;
      } catch (erro) {
        if (erro.status === 500) {
          showSnackbar("Erro no servidor", "error");
          return;
        } else if (erro.status === 404) {
          showSnackbar("funcionarios não encontrados", "error");
          return;
        }
        showSnackbar("Erro ao buscar os funcionarios no servidor", "error");
        return;
      }
    };
    buscarFuncionarios();
    setCarregando(false);
  }, []);

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  return {
    localizer,
    Status,
    eventos,
    verEvento,
    selecaoDeSlot,
    verModal,
    fecharModal,
    confirmarAgendamento,
    cliente,
    alterarCliente,
    clientes,
    funcionario,
    alterarFuncionario,
    funcionarios,
    servico,
    alterarServico,
    servicos,
    status,
    setStatus,
    slotSelecionado,
    verAgendamento,
    fecharModalAgendamento,
    agendamento,
    atualizarAgendamento,
    deloetarAgendamento,
    acharFuncionario,
    carregando,
    snackbarMessage,
    snackbarOpen,
    snackbarSeverity,
    setSnackbarOpen,
  };
};
