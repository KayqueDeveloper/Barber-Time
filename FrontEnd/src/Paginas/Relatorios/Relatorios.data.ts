import { AlertColor } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { useState, useRef, useEffect } from "react";

interface Agendamento {
  mes: string;
  quantidade: number;
}

interface Servico {
  nome: string;
  quantidade: number;
}

interface Funcionario {
  nome: string;
  agendamentos: number;
}

interface Faturamento {
  mes: string;
  valor: number;
}

const meses = {
  "1": "Janeiro",
  "2": "Fevereiro",
  "3": "Março",
  "4": "Abril",
  "5": "Maio",
  "6": "Junho",
  "7": "Julho",
  "8": "Agosto",
  "9": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro",
};

export const useRelatorios = () => {
  const [carregando, setCarregando] = useState<boolean>(true);
  const [agendamentosPorMes, setAgendamentosPorMes] = useState<Agendamento[]>(
    []
  );
  const [servicosMaisPopulares, setServicosMaisPopulares] = useState<Servico[]>(
    []
  );
  const [funcionariosMaisAtivos, setFuncionariosMaisAtivos] = useState<
    Funcionario[]
  >([]);
  const [faturamento, setFaturamento] = useState<Faturamento[]>([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const relatorioRef = useRef<HTMLDivElement | null>(null);

  // Função para buscar os dados dos relatórios do backend
  const buscarRelatorios = async (): Promise<void> => {
    try {
      const [agendamentosRes, servicosRes, funcionariosRes, faturamentoRes] =
        await Promise.all([
          axios.get<Agendamento[]>(
            "http://localhost:8080/relatorios/agendamentos-por-mes"
          ),
          axios.get<Servico[]>(
            "http://localhost:8080/relatorios/servicos-mais-populares"
          ),
          axios.get<Funcionario[]>(
            "http://localhost:8080/relatorios/funcionarios-mais-ativos"
          ),
          axios.get<Faturamento[]>(
            "http://localhost:8080/relatorios/faturamento-mes"
          ),
        ]);

      setAgendamentosPorMes(agendamentosRes.data);
      setServicosMaisPopulares(servicosRes.data);
      setFuncionariosMaisAtivos(funcionariosRes.data);
      setFaturamento(faturamentoRes.data);
      setCarregando(false);
    } catch (erro) {
      if (erro.status === 500) {
        showSnackbar(
          "Erro no servidor ao buscar realatorios, entre em contato com os desenvolvedores ou tente novamente!",
          "error"
        );
        return;
      }
      showSnackbar("Erro ao buscar relatorios, tente novamente.", "error");
      return;
    }
  };

  useEffect(() => {
    buscarRelatorios();
  }, []);

  const gerarRelatorioDetalhado = (tipo: string): void => {
    const pdf = new jsPDF("p", "mm", "a4");

    switch (tipo) {
      case "agendamentos":
        pdf.text("Relatório Detalhado: Agendamentos por Mês", 10, 10);
        agendamentosPorMes.forEach((item, index) => {
          pdf.text(
            `${meses[item?.mes]}: ${item.quantidade} agendamentos`,
            10,
            20 + index * 10
          );
        });
        break;
      case "servicos":
        pdf.text("Relatório Detalhado: Serviços Mais Solicitados", 10, 10);
        servicosMaisPopulares.forEach((servico, index) => {
          pdf.text(
            `${servico.nome}: ${servico.quantidade} solicitações`,
            10,
            20 + index * 10
          );
        });
        break;
      case "funcionarios":
        pdf.text("Relatório Detalhado: Funcionários Mais Ativos", 10, 10);
        funcionariosMaisAtivos.forEach((funcionario, index) => {
          pdf.text(
            `${funcionario.nome}: ${funcionario.agendamentos} agendamentos`,
            10,
            20 + index * 10
          );
        });
        break;
      case "faturamento":
        pdf.text("Relatório Detalhado: Faturamento por Mês", 10, 10);
        faturamento.forEach((item, index) => {
          console.log(item);
          pdf.text(
            `${item?.mes}: R$ ${item.valor.toFixed(2)}`,
            10,
            20 + index * 10
          );
        });
        break;
      default:
        break;
    }

    pdf.save(`relatorio-detalhado-${tipo}.pdf`);
  };

  const gerarPDF = (): void => {
    const input = relatorioRef.current;
    html2canvas(input as HTMLDivElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("relatorio.pdf");
    });
  };

  const dataAgendamentosPorMes = {
    labels: agendamentosPorMes?.map((item) => item.mes),
    datasets: [
      {
        label: "Agendamentos por Mês",
        data: agendamentosPorMes?.map((item) => item.quantidade),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const dataServicosMaisPopulares = {
    labels: servicosMaisPopulares?.map((servico) => servico.nome),
    datasets: [
      {
        label: "Serviços Mais Solicitados",
        data: servicosMaisPopulares?.map((servico) => servico.quantidade),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const opcoes = {
    plugins: {
      datalabels: {
        color: "#000",
        font: {
          size: 14,
        },
        formatter: (value: number) => value,
        anchor: "end" as const, // Adicionando `as const` para fixar o tipo corretamente
        align: "start" as const, // Adicionando `as const` para fixar o tipo corretamente
      },
    },
  };

  const dataFuncionariosMaisAtivos = {
    labels: funcionariosMaisAtivos?.map((funcionario) => funcionario?.nome),
    datasets: [
      {
        label: "Funcionários Mais Ativos",
        data: funcionariosMaisAtivos?.map(
          (funcionario) => funcionario?.agendamentos
        ),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const dataFaturamento = {
    labels: faturamento?.map((item) => item.mes),
    datasets: [
      {
        label: "Faturamento (R$)",
        data: faturamento?.map((item) => item.valor),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };
  return {
    carregando,
    relatorioRef,
    gerarPDF,
    gerarRelatorioDetalhado,
    dataServicosMaisPopulares,
    opcoes,
    dataFuncionariosMaisAtivos,
    dataFaturamento,
    dataAgendamentosPorMes,
    snackbarSeverity,
    snackbarMessage,
    snackbarOpen,
    setSnackbarOpen,
  };
};
