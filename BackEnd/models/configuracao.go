package models

type Configuracao struct {
	ID                 int    `json:"id"`
	HorarioAbertura    string `json:"horario_abertura"`
	HorarioFechamento  string `json:"horario_fechamento"`
	NotificacoesAtivas bool   `json:"notificacoes_ativas"`
	AtualizadoEm       string `json:"atualizado_em"` // Data da última atualização
}
