package controllers

import (
	db "barberTime/database"
	"barberTime/models"
	"database/sql"
	"encoding/json"
	"net/http"
)

// Buscar as configurações
func BuscarConfiguracao(w http.ResponseWriter, r *http.Request) {
	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var configuracao models.Configuracao
	err = db.QueryRow("SELECT id, horario_abertura, horario_fechamento, notificacoes_ativas, atualizado_em FROM barbearia.configuracoes WHERE id = 1").Scan(
		&configuracao.ID, &configuracao.HorarioAbertura, &configuracao.HorarioFechamento, &configuracao.NotificacoesAtivas, &configuracao.AtualizadoEm)

	if err == sql.ErrNoRows {
		http.Error(w, "Configurações não encontradas", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Erro ao buscar configurações", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(configuracao)
}

// Atualizar as configurações
func AtualizarConfiguracao(w http.ResponseWriter, r *http.Request) {
	var configuracao models.Configuracao
	err := json.NewDecoder(r.Body).Decode(&configuracao)
	if err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, err = db.Exec(
		"UPDATE barbearia.configuracoes SET horario_abertura = $1, horario_fechamento = $2, notificacoes_ativas = $3, atualizado_em = NOW() WHERE id = 1",
		configuracao.HorarioAbertura, configuracao.HorarioFechamento, configuracao.NotificacoesAtivas,
	)

	if err != nil {
		http.Error(w, "Erro ao atualizar configurações", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
