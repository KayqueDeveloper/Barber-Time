package models

type Funcionario struct {
	ID            int      `json:"id"`
	Nome          string   `json:"nome"`
	Especialidade string   `json:"especialidade"`
	Telefone      string   `json:"telefone"`
	CriadoEm      string   `json:"criado_em"`
	Cpf           *string  `json:"cpf"`
	Cargo         *string  `json:"cargo"`
	Salario       *float32 `json:"salario"`
}
