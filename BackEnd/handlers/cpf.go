package handlers

import (
	database "barberTime/database"
	"database/sql"
	"encoding/json"
	"net/http"
	"regexp"
)

type CpfRequest struct {
	Cpf   string `json:"cpf"`
	Table string `json:"table"`
}

func sanitizeCPF(cpf string) string {
	re := regexp.MustCompile(`\D`) // Remove caracteres não numéricos
	return re.ReplaceAllString(cpf, "")
}

func CpfVerificacao(w http.ResponseWriter, r *http.Request) {
	var cpfReq CpfRequest
	err := json.NewDecoder(r.Body).Decode(&cpfReq)
	if err != nil {
		http.Error(w, "Dados inválidos", http.StatusBadRequest)
		return
	}

	// Sanitizar CPF

	// Validar tabela
	if cpfReq.Table != "cliente" && cpfReq.Table != "funcionario" {
		http.Error(w, "Tabela inválida", http.StatusBadRequest)
		return
	}

	db, err := database.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var id int
	var query string

	if cpfReq.Table == "cliente" {
		query = "SELECT id FROM barbearia.clientes WHERE cpf = $1"
	} else {
		query = "SELECT id FROM barbearia.funcionarios WHERE cpf = $1"
	}

	err = db.QueryRow(query, cpfReq.Cpf).Scan(&id)
	if err == sql.ErrNoRows {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("CPF liberado"))
		return
	} else if err != nil {
		http.Error(w, "Erro ao verificar CPF no banco", http.StatusInternalServerError)
		return
	}

	// CPF já existe
	http.Error(w, "CPF já existe", http.StatusConflict)
}
