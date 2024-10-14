package models

type Funcionario struct {
	ID            int    `json:"id"`
	Nome          string `json:"nome"`
	Especialidade string `json:"especialidade"`
	Telefone      string `json:"telefone"`
	CriadoEm      string `json:"criado_em"` // Data de criação
}
