import { z } from "zod";

export const AgendamentoSchema = z.object({
  id: z.number(),
  cliente_id: z.number(),
  funcionario_id: z.number(),
  servico_id: z.number(),
  data_agendamento: z.string(),
  data_final_agendamento: z.string(),
  status: z.string(),
  criado_em: z.string(),
  nome_cliente: z.string(),
  nome_servico: z.string(),
});

export const FuncionarioSchema = z.object({
  id: z.number(),
  nome: z.string(),
  especialidade: z.string(),
  telefone: z.string(),
  criado_em: z.string(),
  cpf: z.string(),
  cargo: z.string().nullable().optional(),
  salario: z.number().nullable().optional(),
});

export const ConfiguracaoSchema = z.object({
  id: z.number(),
  horario_abertura: z.string(),
  horario_fechamento: z.string(),
  notificacoes_ativas: z.boolean(),
  atualizado_em: z.string(),
});

export const ClienteSchema = z.object({
  id: z.number(),
  nome: z.string(),
  telefone: z.string(),
  email: z.string(),
  criado_em: z.string(),
  cpf: z.string(),
  cep: z.string().nullable().optional(),
  rua: z.string().nullable().optional(),
  estado: z.string().nullable().optional(),
  cidade: z.string().nullable().optional(),
  bairro: z.string().nullable().optional(),
});

export const ServicoSchema = z.object({
  id: z.number(),
  nome: z.string(),
  preco: z.number(),
  duracao: z.number(),
  criado_em: z.string(),
});

// Inferindo os tipos a partir dos schemas
export type Agendamento = z.infer<typeof AgendamentoSchema>;
export type Funcionario = z.infer<typeof FuncionarioSchema>;
export type Configuracao = z.infer<typeof ConfiguracaoSchema>;
export type Cliente = z.infer<typeof ClienteSchema>;
export type Servico = z.infer<typeof ServicoSchema>;
