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

	// Lendo os parâmetros de paginação e pesquisa
	pageParam := r.URL.Query().Get("page")
	limitParam := r.URL.Query().Get("limit")
	search := r.URL.Query().Get("search")

	// Definindo paginação padrão
	page, err := strconv.Atoi(pageParam)
	if err != nil || page < 1 {
		page = 1
	}
	limit, err := strconv.Atoi(limitParam)
	if err != nil || limit < 1 {
		limit = 1000 // Número padrão de serviços por página
	}

	// Calcula o offset com base na página e no limite
	offset := (page - 1) * limit

	// Construindo a query com filtro e paginação
	query := "SELECT id, nome, preco, duracao, criado_em FROM barbearia.servicos WHERE nome ILIKE '%' || $1 || '%' ORDER BY nome LIMIT $2 OFFSET $3"
	rows, err := db.Query(query, search, limit, offset)
	if err != nil {
		http.Error(w, "Erro ao buscar dados", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Preenchendo a lista de serviços
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

	// Contagem total de serviços para paginação
	var totalServicos int
	err = db.QueryRow("SELECT COUNT(*) FROM barbearia.servicos WHERE nome ILIKE '%' || $1 || '%'", search).Scan(&totalServicos)
	if err != nil {
		http.Error(w, "Erro ao contar serviços", http.StatusInternalServerError)
		return
	}

	// Calcula o número total de páginas
	totalPages := (totalServicos + limit - 1) / limit

	// Monta a resposta com serviços e informações de paginação
	response := map[string]interface{}{
		"servicos":    servicos,
		"totalPages":  totalPages,
		"currentPage": page,
	}

	// Envia a resposta em JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
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
		http.Error(w, err.Error(), http.StatusBadRequest)
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
