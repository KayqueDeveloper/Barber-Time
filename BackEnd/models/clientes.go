package models

type Cliente struct {
	ID       int     `json:"id"`
	Nome     string  `json:"nome"`
	Telefone string  `json:"telefone"`
	Email    string  `json:"email"`
	CriadoEm string  `json:"criado_em"`
	Cpf      *string `json:"cpf"`
	Cep      *string `json:"cep"`
	Rua      *string `json:"rua"`
	Estado   *string `json:"estado"`
	Cidade   *string `json:"cidade"`
	Bairro   *string `json:"bairro"`
}
