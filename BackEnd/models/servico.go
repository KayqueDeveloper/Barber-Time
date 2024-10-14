package models

type Servico struct {
	ID       int     `json:"id"`
	Nome     string  `json:"nome"`
	Preco    float64 `json:"preco"`
	Duracao  string  `json:"duracao"`   // Usando string para representar o tempo de duração
	CriadoEm string  `json:"criado_em"` // Data de criação
}
