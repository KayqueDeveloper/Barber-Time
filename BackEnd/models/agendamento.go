package models

type Agendamento struct {
	ID                   int    `json:"id"`
	ClienteID            int    `json:"cliente_id"`
	FuncionarioID        int    `json:"funcionario_id"`
	ServicoID            int    `json:"servico_id"`
	DataAgendamento      string `json:"data_agendamento"`
	DataFinalAgendamento string `json:"data_final_agendamento"`
	Status               string `json:"status"`
	CriadoEm             string `json:"criado_em"`
	NomeCliente          string `json:"nome_cliente"`
	NomeServico          string `json:"nome_servico"`
	NomeFuncionario      string `json:"nome_funcionario"`
}
