import axios from "axios";

export const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, ""); // Remove qualquer caractere não numérico

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false; // CPF inválido: contém todos os mesmos números
  }

  let soma = 0;
  let resto;

  // Valida o primeiro dígito
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) {
    return false; // CPF inválido
  }

  soma = 0;
  // Valida o segundo dígito
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) {
    return false; // CPF inválido
  }

  return true; // CPF válido
};

export const FormatarSalario = (salario) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(salario);
};

export const verificarCpf = async (cpf, table, setError) => {
  try {
    const response = await axios.post("http://localhost:8080/verificar-cpf", {
      cpf,
      table, // Certifique-se de que esta é a tabela correta
    });
    return response.status === 200; // CPF está liberado
  } catch (error) {
    if (error.response && error.response.status === 409) {
      setError("CPF já cadastrado.");
      return false;
    }
    setError("Erro ao verificar CPF.");
    return false;
  }
};
