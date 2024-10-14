package controllers

import (
	db "barberTime/database"
	"barberTime/models"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// Listar todos os serviços
func ListarServicos(w http.ResponseWriter, r *http.Request) {
	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, nome, preco, duracao, criado_em FROM barbearia.servicos")
	if err != nil {
		http.Error(w, "Erro ao buscar dados", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var servicos []models.Servico
	for rows.Next() {
		var servico models.Servico
		err := rows.Scan(&servico.ID, &servico.Nome, &servico.Preco, &servico.Duracao, &servico.CriadoEm)
		if err != nil {
			http.Error(w, "Erro ao escanear dados", http.StatusInternalServerError)
			return
		}
		servicos = append(servicos, servico)
	}

	json.NewEncoder(w).Encode(servicos)
}

// Buscar um serviço específico por ID
func BuscarServico(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var servico models.Servico
	err = db.QueryRow("SELECT id, nome, preco, duracao, criado_em FROM barbearia.servicos WHERE id = $1", id).Scan(
		&servico.ID, &servico.Nome, &servico.Preco, &servico.Duracao, &servico.CriadoEm)

	if err == sql.ErrNoRows {
		http.Error(w, "Serviço não encontrado", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Erro ao buscar serviço", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(servico)
}

// Criar um novo serviço
func CriarServico(w http.ResponseWriter, r *http.Request) {
	var servico models.Servico
	err := json.NewDecoder(r.Body).Decode(&servico)
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

	err = db.QueryRow("INSERT INTO barbearia.servicos (nome, preco, duracao, criado_em) VALUES ($1, $2, $3, NOW()) RETURNING id",
		servico.Nome, servico.Preco, servico.Duracao).Scan(&servico.ID)

	if err != nil {
		http.Error(w, "Erro ao criar serviço", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(servico)
}

// Atualizar um serviço existente
func AtualizarServico(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var servico models.Servico
	err = json.NewDecoder(r.Body).Decode(&servico)
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

	_, err = db.Exec("UPDATE barbearia.servicos SET nome = $1, preco = $2, duracao = $3 WHERE id = $4",
		servico.Nome, servico.Preco, servico.Duracao, id)

	if err != nil {
		http.Error(w, "Erro ao atualizar serviço", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Excluir um serviço
func ExcluirServico(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	db, err := db.Conectar()
	if err != nil {
		http.Error(w, "Erro ao conectar com o banco de dados", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, err = db.Exec("DELETE FROM barbearia.servicos WHERE id = $1", id)
	if err != nil {
		http.Error(w, "Erro ao excluir serviço", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
